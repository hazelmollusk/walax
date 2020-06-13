# Generated by Django 3.0.7 on 2020-06-13 01:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('publish_date', models.DateField(auto_now=True)),
                ('genre', models.PositiveSmallIntegerField(choices=[(0, 'Rock'), (1, 'Country'), (3, 'Jazz'), (2, 'Classical'), (4, 'Miscellaneous')])),
            ],
        ),
        migrations.CreateModel(
            name='Band',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('genre', models.PositiveSmallIntegerField(choices=[(0, 'Rock'), (1, 'Country'), (3, 'Jazz'), (2, 'Classical'), (4, 'Miscellaneous')])),
            ],
        ),
        migrations.CreateModel(
            name='Inventory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
                ('count', models.PositiveSmallIntegerField(default=0)),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='records.Album')),
            ],
        ),
        migrations.CreateModel(
            name='Store',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('albums', models.ManyToManyField(through='records.Inventory', to='records.Album')),
            ],
        ),
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('genre', models.PositiveSmallIntegerField(choices=[(0, 'Rock'), (1, 'Country'), (3, 'Jazz'), (2, 'Classical'), (4, 'Miscellaneous')])),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='records.Album')),
            ],
        ),
        migrations.AddField(
            model_name='inventory',
            name='store',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='records.Store'),
        ),
        migrations.AddField(
            model_name='album',
            name='band',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='records.Band'),
        ),
    ]
