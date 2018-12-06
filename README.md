# Cerebral Beers :beers::beers::beers:

**Table of Contents**

- [Beers](#Beers)
- [Styles](#Styles)

---

## Beers :beer:

- **GET** - All Beers: `/api/v1/cerebral_beers/beer`

This endpoint will return an array of all Cerebral beers, current and passed.

##### Example Response

```
  [
    {
        "id": 81,
        "style_id": 88,
        "abv": "5.2% ABV",
        "description": "A generous helping of oats make this Third Wave Pale Ale dangerously drinkable. Bursting with notes of grapefruit rind, orange marmalade and papaya.",
        "is_available": false,
        "created_at": "2018-12-05T04:37:02.782Z",
        "updated_at": "2018-12-05T04:37:02.782Z",
        "name": "MUSCLE MEMORY"
    },
    {
        "id": 82,
        "style_id": 89,
        "abv": "7.4% ABV",
        "description": "Brewed with a generous amount of both malted and flaked wheat and hopped with heaps of Mosaic, Columbus and Simcoe and again with Mosaic Lupulin Powder. A/S/L?",
        "is_available": false,
        "created_at": "2018-12-05T04:37:02.782Z",
        "updated_at": "2018-12-05T04:37:02.782Z",
        "name": "SUPER SECRET CHAT ROOM"
    }
  ]

```

---

## Styles :beer:

- **GET** - All Styles: `/api/v1/cerebral_beers/styles`

Hitting this endpoint will return an array of all beer styles.

##### Example Response

```
  [
    {
        "id": 55,
        "style_name": "Barrel Aged Biere de Garde",
        "description": "",
        "created_at": "2018-12-05T04:37:02.701Z",
        "updated_at": "2018-12-05T04:37:02.701Z"
    },
    {
        "id": 56,
        "style_name": "Brettanomyces Saison",
        "description": "",
        "created_at": "2018-12-05T04:37:02.708Z",
        "updated_at": "2018-12-05T04:37:02.708Z"
    }
  ]
```

- **POST** - Add A Style: `/api/v1/cerebral_beers/styles`

This endpoint allows the user to create a new beer style. The request object requires a `description` and `style_name` properties. Valid posts will receive ```Beer Style successfully added!``` in response.

##### Example Request

```
  {
    "description": "Pilsner is a pale lager which takes its name from the Bohemian city of Pilsen."
    "name": "Pilsner"
  }
```
