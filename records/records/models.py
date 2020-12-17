from django.db import models

ROCK, COUNTRY, CLASSICAL, JAZZ, MISC = tuple(range(0, 5))
GENRE_CHOICES = [
    (ROCK, 'Rock'),
    (COUNTRY, 'Country'),
    (JAZZ, 'Jazz'),
    (CLASSICAL, 'Classical'),
    (MISC, 'Miscellaneous')
]


class Band(models.Model):
    name = models.CharField(max_length=50)
    genre = models.PositiveSmallIntegerField(choices=GENRE_CHOICES)
    def __str__(self): return self.name


class Album(models.Model):
    name = models.CharField(max_length=50)
    publish_date = models.DateField(auto_now=True)
    genre = models.PositiveSmallIntegerField(choices=GENRE_CHOICES)
    band = models.ForeignKey(Band, on_delete=models.CASCADE)
    def __str__(self): return self.name

class Song(models.Model):
    name = models.CharField(max_length=50)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    genre = models.PositiveSmallIntegerField(choices=GENRE_CHOICES)
    def __str__(self): return self.name

class Store(models.Model):
    name = models.CharField(max_length=50)
    albums = models.ManyToManyField(Album, through='Inventory')
    def __str__(self): return self.name

class Inventory(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    count = models.PositiveSmallIntegerField(default=0)
    
    class Meta:
        verbose_name_plural = 'Inventories'
