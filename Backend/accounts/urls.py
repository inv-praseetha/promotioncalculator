from django.urls import path
from .views import AccountsView

urlpatterns = [
    path("accounts/", AccountsView.as_view(), name="accounts"),

]