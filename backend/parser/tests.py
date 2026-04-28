from django.test import TestCase

from parser.domain import Grammar, GrammarError, TreeBuilder, ASTBuilder, DerivationEngine


class ParserDomainTests(TestCase):
	def test_grammar_from_bnf_and_parse(self):
		g = Grammar.from_bnf("S -> 'a'")
		trees = g.parse("a")
		self.assertTrue(len(trees) >= 1)

	def test_grammar_with_equals_format(self):
		"""Test that E = E + T format works (class notation)"""
		g = Grammar.from_bnf("E = E + T | T\nT = n")
		trees = g.parse("n + n")
		self.assertTrue(len(trees) >= 1)

	def test_grammar_auto_quotes_terminals(self):
		"""Test that terminals are auto-quoted: E = E + T becomes E -> E '+' T"""
		g = Grammar.from_bnf("E = E + n | n")
		# Should parse successfully with auto-quoted terminals
		trees = g.parse("n + n")
		self.assertTrue(len(trees) >= 1)

	def test_invalid_rule_raises(self):
		with self.assertRaises(GrammarError):
			Grammar.from_bnf("S a")

	def test_empty_text_raises(self):
		g = Grammar.from_bnf("S -> a")
		with self.assertRaises(GrammarError):
			g.parse("")

	def test_derivation_left_and_right_end_with_input(self):
		bnf = "S -> S '+' T | T\nT -> 'a' | 'b'"
		g = Grammar.from_bnf(bnf)
		engine = DerivationEngine(g)
		for typ in ("left", "right"):
			steps = engine.derive("a + b", derivation_type=typ)
			self.assertEqual(steps[-1].strip(), "a + b")

	def test_tree_and_ast_builders(self):
		bnf = "S -> 'a' '+' 'b'"
		g = Grammar.from_bnf(bnf)
		trees = g.parse("a + b")
		node = TreeBuilder.from_nltk_tree(trees[0])
		d = node.to_dict()
		self.assertIn("name", d)
		ast = ASTBuilder.from_parse_tree(node)
		self.assertIsNotNone(ast)
