# Generated by Django 3.0.9 on 2020-08-18 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_apps'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apps',
            name='token',
            field=models.BinaryField(max_length=500),
        ),
    ]