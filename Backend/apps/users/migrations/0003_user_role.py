from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_alter_user_options"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("super_admin", "Super admin"),
                    ("editor", "Éditeur"),
                    ("reader", "Lecture seule"),
                ],
                db_index=True,
                default="reader",
                max_length=20,
            ),
        ),
    ]
