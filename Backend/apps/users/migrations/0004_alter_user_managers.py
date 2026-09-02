from django.db import migrations

import apps.users.models


def assign_super_admin_role(apps, schema_editor):
    User = apps.get_model("users", "User")
    User.objects.filter(is_superuser=True).update(role="super_admin")


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0003_user_role"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="user",
            managers=[
                ("objects", apps.users.models.UserManager()),
            ],
        ),
        migrations.RunPython(assign_super_admin_role, migrations.RunPython.noop),
    ]
