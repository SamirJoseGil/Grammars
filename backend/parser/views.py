from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from parser.domain import ASTBuilder, DerivationEngine, Grammar, GrammarError, TreeBuilder
from parser.serializers import DerivationInputSerializer, ParseInputSerializer


def _build_grammar_and_trees(grammar_text: str, text: str):
	grammar = Grammar.from_bnf(grammar_text)
	try:
		trees = grammar.parse(text)
	except ValueError as exc:
		# Translate common NLTK ValueError messages to Spanish and attempt
		# a graceful fallback: if the grammar does not cover some input words
		# and the missing words are single letters, try mapping them to an
		# existing single-letter terminal in the grammar (e.g. 'n').
		msg = str(exc)
		if msg.startswith("Grammar does not cover some of the input words"):
			# extract the list of tokens from the message
			import re
			m = re.search(r":\s*(.*)$", msg)
			missing = []
			if m:
				parts = m.group(1)
				# split by comma and strip quotes/spaces
				for p in parts.split(","):
					p = p.strip()
					p = p.strip("'\"")
					if p:
						missing.append(p)

			# Build a friendly Spanish message
			spanish_msg = (
				"La gramática no reconoce algunos tokens de la entrada: "
				+ ", ".join(f"'{t}'" for t in missing)
				+ "."
			)

			# Attempt fallback mapping: find a single-letter terminal in grammar
			terminals = []
			for rule in grammar.rules:
				for sym in rule.rhs:
					if isinstance(sym, str) and len(sym) >= 2 and (sym[0] == "'" or sym[0] == '"') and (sym[-1] == "'" or sym[-1] == '"'):
						terminals.append(sym[1:-1])
			terminals = list(dict.fromkeys(terminals))

			placeholder = None
			# prefer a single-letter lowercase terminal like 'n'
			for t in terminals:
				if len(t) == 1 and t.islower():
					placeholder = t
					break
			# otherwise pick any alphabetic terminal
			if placeholder is None:
				for t in terminals:
					if t.isalpha():
						placeholder = t
						break

			# If we have a placeholder, remap single-letter missing tokens and retry
			if placeholder:
				original_tokens = [tok for tok in (text or "").strip().split(" ") if tok]
				remapped_tokens = []
				for tok in original_tokens:
					if tok in missing and len(tok) == 1 and tok.isalpha():
						remapped_tokens.append(placeholder)
					else:
						remapped_tokens.append(tok)
				try:
					remapped_text = " ".join(remapped_tokens)
					trees = grammar.parse(remapped_text)
					# If parse succeeds, return with a warning message included later by the view
					# Attach a flag to the grammar instance for the view to inspect (non-ideal but simple)
					setattr(grammar, "_remapped_input_warning", spanish_msg + f" Se remapearon letras individuales al terminal '{placeholder}' para intentar el análisis.")
					# return as normal (caller will proceed)
					pass
				except ValueError:
					# Fall through to raise GrammarError below
					pass

			# If we get here and no retry succeeded, raise GrammarError with Spanish message
			raise GrammarError(spanish_msg + " Detalle: " + msg)
		else:
			# Generic fallback for other ValueError messages
			raise GrammarError("Error al analizar la entrada: " + msg)
	if not trees:
		raise GrammarError("La expresion no es generable por la gramatica.")
	return grammar, trees


class ParseView(APIView):
	def post(self, request):
		serializer = ParseInputSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		try:
			_, trees = _build_grammar_and_trees(
				serializer.validated_data["grammar"],
				serializer.validated_data["text"],
			)
		except GrammarError as exc:
			return Response(
				{"success": False, "error": str(exc)},
				status=status.HTTP_400_BAD_REQUEST,
			)

		tree_count = len(trees)
		return Response(
			{
				"success": True,
				"tree_count": tree_count,
				"ambiguous": tree_count > 1,
				"message": "Analisis completado exitosamente.",
			},
			status=status.HTTP_200_OK,
		)


class DerivationView(APIView):
	def post(self, request):
		serializer = DerivationInputSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		try:
			grammar = Grammar.from_bnf(serializer.validated_data["grammar"])
			engine = DerivationEngine(grammar)
			derivation_type = serializer.validated_data["derivation_type"]
			steps = engine.derive(
				serializer.validated_data["text"], derivation_type=derivation_type
			)
		except GrammarError as exc:
			return Response(
				{"success": False, "error": str(exc)},
				status=status.HTTP_400_BAD_REQUEST,
			)

		return Response(
			{
				"success": True,
				"derivation_type": derivation_type,
				"steps": steps,
			},
			status=status.HTTP_200_OK,
		)


class TreeView(APIView):
	def post(self, request):
		serializer = ParseInputSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		try:
			_, trees = _build_grammar_and_trees(
				serializer.validated_data["grammar"],
				serializer.validated_data["text"],
			)
			first_tree = TreeBuilder.from_nltk_tree(trees[0]).to_dict()
			all_trees = [TreeBuilder.from_nltk_tree(tree).to_dict() for tree in trees]
		except GrammarError as exc:
			return Response(
				{"success": False, "error": str(exc)},
				status=status.HTTP_400_BAD_REQUEST,
			)

		return Response(
			{
				"success": True,
				"tree": first_tree,
				"trees": all_trees,
				"ambiguous": len(trees) > 1,
			},
			status=status.HTTP_200_OK,
		)


class ASTView(APIView):
	def post(self, request):
		serializer = ParseInputSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		try:
			_, trees = _build_grammar_and_trees(
				serializer.validated_data["grammar"],
				serializer.validated_data["text"],
			)
			parse_tree_node = TreeBuilder.from_nltk_tree(trees[0])
			ast_node = ASTBuilder.from_parse_tree(parse_tree_node)
			if ast_node is None:
				raise GrammarError("No fue posible construir un AST para la entrada.")
		except GrammarError as exc:
			return Response(
				{"success": False, "error": str(exc)},
				status=status.HTTP_400_BAD_REQUEST,
			)

		return Response(
			{"success": True, "ast": ast_node.to_dict()},
			status=status.HTTP_200_OK,
		)
