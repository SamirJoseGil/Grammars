from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable, List

from nltk import CFG
from nltk.parse import ChartParser
from nltk.tree import Tree


class GrammarError(ValueError):
    """Raised when a grammar cannot be parsed or validated."""


@dataclass(frozen=True)
class ProductionRule:
    lhs: str
    rhs: List[str]


@dataclass
class Grammar:
    source: str
    cfg: CFG
    rules: List[ProductionRule]

    @classmethod
    def from_bnf(cls, bnf_source: str) -> "Grammar":
        source = (bnf_source or "").strip()
        if not source:
            raise GrammarError("La gramatica no puede estar vacia.")

        lines = [line.strip() for line in source.splitlines() if line.strip()]
        rules: List[ProductionRule] = []

        for line in lines:
            # Support both "->" and "=" separators
            if "->" in line:
                lhs, rhs = [part.strip() for part in line.split("->", 1)]
            elif "=" in line:
                lhs, rhs = [part.strip() for part in line.split("=", 1)]
            else:
                raise GrammarError(
                    f"Regla invalida '{line}'. Debe incluir '->' o '='."
                )

            if not lhs:
                raise GrammarError(f"La regla '{line}' no tiene LHS.")
            if not rhs:
                raise GrammarError(f"La regla '{line}' no tiene RHS.")

            for alternative in rhs.split("|"):
                alt = alternative.strip()
                if not alt:
                    raise GrammarError(
                        f"La alternativa '{alternative}' en '{line}' esta vacia."
                    )
                
                # Parse symbols and auto-quote terminals (symbols that aren't quoted yet)
                symbols = []
                tokens = alt.split()
                for token in tokens:
                    if token:
                        # If already quoted, keep as-is
                        if (token.startswith("'") and token.endswith("'")) or (token.startswith('"') and token.endswith('"')):
                            symbols.append(token)
                        # If it looks like a terminal (lowercase, special chars, digits), quote it
                        elif token and (token[0].islower() or token[0] in "+-*/()|&<>=!"):
                            symbols.append(f"'{token}'")
                        # Otherwise it's a nonterminal, keep as-is
                        else:
                            symbols.append(token)
                
                if not symbols:
                    raise GrammarError(
                        f"La alternativa '{alternative}' en '{line}' esta vacia."
                    )
                rules.append(ProductionRule(lhs=lhs, rhs=symbols))

        cfg_lines: List[str] = []
        grouped_rules: dict[str, List[str]] = {}
        for rule in rules:
            grouped_rules.setdefault(rule.lhs, []).append(" ".join(rule.rhs))

        for lhs, rhs_list in grouped_rules.items():
            cfg_lines.append(f"{lhs} -> {' | '.join(rhs_list)}")

        try:
            cfg = CFG.fromstring("\n".join(cfg_lines))
        except Exception as exc:  # pragma: no cover - branch depends on nltk errors
            raise GrammarError(f"No se pudo construir la CFG: {exc}") from exc

        return cls(source=source, cfg=cfg, rules=rules)

    def parse(self, text: str) -> List[Tree]:
        tokens = [token for token in (text or "").strip().split(" ") if token]
        if not tokens:
            raise GrammarError("La expresion a analizar no puede estar vacia.")

        parser = ChartParser(self.cfg)
        trees = list(parser.parse(tokens))
        return trees


@dataclass
class ParseTreeNode:
    value: str
    children: List["ParseTreeNode"] = field(default_factory=list)

    def to_dict(self) -> dict:
        if not self.children:
            return {"name": self.value}
        return {
            "name": self.value,
            "children": [child.to_dict() for child in self.children],
        }


class TreeBuilder:
    @staticmethod
    def from_nltk_tree(tree: Tree) -> ParseTreeNode:
        node = ParseTreeNode(value=tree.label())
        for child in tree:
            if isinstance(child, Tree):
                node.children.append(TreeBuilder.from_nltk_tree(child))
            else:
                node.children.append(ParseTreeNode(value=str(child)))
        return node


@dataclass
class ASTNode:
    value: str
    children: List["ASTNode"] = field(default_factory=list)

    def to_dict(self) -> dict:
        if not self.children:
            return {"name": self.value}
        return {
            "name": self.value,
            "children": [child.to_dict() for child in self.children],
        }


class ASTBuilder:
    IGNORED_TOKENS = {"(", ")", "[", "]", "{", "}", ","}
    OPERATORS = {"+", "-", "*", "/", "^", "=", "%"}

    @classmethod
    def from_parse_tree(cls, tree: ParseTreeNode) -> ASTNode | None:
        return cls._simplify(tree)

    @classmethod
    def _simplify(cls, node: ParseTreeNode) -> ASTNode | None:
        if not node.children:
            if node.value in cls.IGNORED_TOKENS:
                return None
            return ASTNode(value=node.value)

        simplified_children = [
            child for child in (cls._simplify(child) for child in node.children) if child
        ]

        if not simplified_children:
            return None

        operator_index = next(
            (
                index
                for index, child in enumerate(simplified_children)
                if child.value in cls.OPERATORS and not child.children
            ),
            None,
        )

        if operator_index is not None:
            operator_node = simplified_children[operator_index]
            operands = [
                child
                for index, child in enumerate(simplified_children)
                if index != operator_index
                and not (child.value in cls.OPERATORS and not child.children)
            ]
            if len(operands) >= 2:
                return ASTNode(value=operator_node.value, children=operands)

        if len(simplified_children) == 1:
            return simplified_children[0]

        return ASTNode(value=node.value, children=simplified_children)


class DerivationEngine:
    def __init__(self, grammar: Grammar):
        self.grammar = grammar

    def derive(self, text: str, derivation_type: str = "left") -> List[str]:
        trees = self.grammar.parse(text)
        if not trees:
            raise GrammarError("La expresion no es generable por la gramatica.")
        tree = trees[0]
        return self._derive_from_tree(tree, derivation_type)

    @staticmethod
    def _derive_from_tree(tree: Tree, derivation_type: str) -> List[str]:
        if derivation_type not in {"left", "right"}:
            raise GrammarError("El tipo de derivacion debe ser 'left' o 'right'.")

        # Each frontier item stores: (symbol, is_nonterminal, backing_tree)
        frontier: list[tuple[str, bool, Tree | None]] = [(tree.label(), True, tree)]
        steps = [DerivationEngine._frontier_to_text(frontier)]

        while True:
            candidate_indexes = [
                index for index, item in enumerate(frontier) if item[1] and item[2] is not None
            ]
            if not candidate_indexes:
                break

            target_index = (
                candidate_indexes[0]
                if derivation_type == "left"
                else candidate_indexes[-1]
            )
            _, _, target_tree = frontier[target_index]
            replacement = DerivationEngine._expand_node(target_tree)
            frontier = frontier[:target_index] + replacement + frontier[target_index + 1 :]
            steps.append(DerivationEngine._frontier_to_text(frontier))

        return steps

    @staticmethod
    def _expand_node(node: Tree | None) -> list[tuple[str, bool, Tree | None]]:
        if node is None:
            return []

        expanded: list[tuple[str, bool, Tree | None]] = []
        for child in node:
            if isinstance(child, Tree):
                expanded.append((child.label(), True, child))
            else:
                expanded.append((str(child), False, None))
        return expanded

    @staticmethod
    def _frontier_to_text(frontier: Iterable[tuple[str, bool, Tree | None]]) -> str:
        return " ".join(item[0] for item in frontier)
