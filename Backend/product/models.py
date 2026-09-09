from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50)
    is_active =models.BooleanField(default=True)
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
class Product(models.Model):
    name=models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE,related_name="product")
    price=models.DecimalField(max_digits=10, decimal_places=2)
    is_active =models.BooleanField(default=True)
    count=models.IntegerField(default=0)
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.category.name}"