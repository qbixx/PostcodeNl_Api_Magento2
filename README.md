Postcode.nl International Address API module for Magento 2
=============

Adds autocompletion for addresses to the checkout page. Multiple countries are supported using official postal data via the [Postcode.nl](https://postcode.nl) API.

This module has been created for Postcode.nl by [Flekto](https://www.flekto.nl).


Postcode.nl Account
=============

A [Postcode.nl account](https://www.postcode.nl/en/services/adresdata/producten-overzicht) is required.
Testing is free. After testing you can choose to purchase a subscription. 

Installation instructions
=============

1. Install this component using Composer:

Add this repo to your composer file:

```bash
"repositories": {
    "qbixx": {
        "type": "git",
        "url": "git@github.com:qbixx/PostcodeNl_Api_Magento2.git"
    }
}
```

```bash
$ composer require qbixx/api-magento2-module
```

2. Upgrade, compile & clear cache:
```bash
$ php bin/magento setup:upgrade
$ php bin/magento setup:di:compile
$ php bin/magento cache:flush
```

License
=============

The code is available under the Simplified BSD License, see the included LICENSE file.
