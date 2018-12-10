<img src="https://github.com/flevenson/BuildYourOwnBackend/blob/master/images/cerebral-logo.png" width="500px"/>

[![Build Status](https://travis-ci.org/flevenson/BuildYourOwnBackend.svg?branch=master)](https://travis-ci.org/flevenson/BuildYourOwnBackend)

[![Waffle.io - Columns and their card count](https://badge.waffle.io/flevenson/BuildYourOwnBackend.svg?columns=all)](https://waffle.io/flevenson/BuildYourOwnBackend)

# Welcome to the Cerebral Beers Open-Source Project! 
:beers::beers::beers:

**API Table of Contents**

- [API Documentation](#cerebral-beers-api-documentation)
- [Getting Setup](#getting-setup)
- [How to Contribute](#how-to-contribute)


## Cerebral Beers API Documentation
:beer::beer::beer:

**API Table of Contents**

- [Beers](#beers)
- [Styles](#styles)

---

## Beers

- **GET** - Get All Beers: `/api/v1/cerebral_beers/beer`

This endpoint will return an array of all Cerebral beers, current and passed.

#### Example Response

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

- **GET** - Get All Currently Available Beers: `/api/v1/cerebral_beers/currently_available/:availability`

This endpoint will return all currently available beers.

```
'/api/v1/cerebral_beers/currently_available/true'

```

All previously available beers may be retieved:

```
'/api/v1/cerebral_beers/currently_available/false'

```

---

- **POST** - Add a Beer: `/api/v1/cerebral_beers/beer`

This endpoint allows users to add a new beer. A beer may not be added if its style is not already in the database. The request object requires `name`, `description`, `abv`, `is_available` and `style` properties. Valid posts will receive `Beer successfully added!` in response.

#### Example Request:

```
{
	"name": "Thornless",
	"description": "Soured with a house culture of Lactobacillus then conditioned on over 330 pounds of blackberry as well as Ceylon cinnamon and Madagascar vanilla beans.",
	"abv": "5.5% ABV",
	"is_available": true,
	"style": "Smoothie-Style Sour"
}
```

---

- **PATCH** - Update ABV of a Beer:
  `/api/v1/cerebral_beers/beer/`

This endpoint allows users to update the ABV of a specific beer. The request object requires `name` and `abv` properties. ABV's must be sent as a number (numbers including a decimal are accepted). Valid requests will receive `ABV of [name] sucessfully updated!` in response.

#### Example Request:

```
{
	"name": "Thornless",
	"abv": 5.5,
}
```

---

- **PATCH** - Update Availability of a Beer:
  `/api/v1/cerebral_beers/beer/:name/:availability`

This endpoint allows users to update the availability of a specific beer to true or false. Valid requests will receive `Availability of [name] sucessfully updated!` in response.

#### Example URL's:

`api/v1/cerebral_beers/beer/hollow+fang/true`

`api/v1/cerebral_beers/beer/Remote+Island/False`

---

- **DELETE** - Delete a Beer: `/api/v1/cerebral_beers/beer/:name`

This endpoint allows users to delete a beer. Valid deletions will receive `Beer [name] successfully deleted!` in response.

#### Example URL:

`/api/v1/cerebral_beers/beer/DDH+Strange+Claw`

---

:beer::beer::beer:

## Styles

- **GET** - Get All Styles: `/api/v1/cerebral_beers/styles`

This endpoint will return an array of all beer styles.

#### Example Response:

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

---

- **GET** - Get All Beers of a Style: `/api/v1/cerebral_beers/find_by_style`

This endpoint will return all beers of a specified style.

#### Example URL:

```
'/api/v1/cerebral_beers/find_by_style?style_name=India+Pale+Ale'

```

---

- **POST** - Add a Style: `/api/v1/cerebral_beers/styles`

This endpoint allows users to create a new beer style. The request object requires `description` and `style_name` properties. Valid posts will receive `Beer Style successfully added!` in response.

#### Example Request:

```
  {
    "description": "Pilsner is a pale lager which takes its name from the Bohemian city of Pilsen."
    "style_name": "Pilsner"
  }
```

---

- **DELETE** - Delete a Style: `/api/v1/cerebral_beers/styles/:name`

This endpoint allows users to delete a beer style. Valid deletions will receive `Style [name] successfully deleted!` in response.

A beer style may not be deleted if there is a beer in the database under that style. These requests will be met with a 405 error and `You're most likely trying to delete a style that has beers attached to it. Please remove those beers first!` in response.

#### Example URL:

`/api/v1/cerebral_beers/styles/India+Pale+Ale`

---

## Getting Setup:
:beer::beer::beer:

---

## How to Contribute:
:beer::beer::beer:
