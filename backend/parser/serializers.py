from rest_framework import serializers


class ParseInputSerializer(serializers.Serializer):
    grammar = serializers.CharField()
    text = serializers.CharField()


class DerivationInputSerializer(ParseInputSerializer):
    derivation_type = serializers.ChoiceField(choices=["left", "right"])
