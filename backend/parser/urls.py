from django.urls import path

from parser.views import ASTView, DerivationView, ParseView, TreeView

urlpatterns = [
    path("parse", ParseView.as_view(), name="parse"),
    path("derivation", DerivationView.as_view(), name="derivation"),
    path("tree", TreeView.as_view(), name="tree"),
    path("ast", ASTView.as_view(), name="ast"),
]
