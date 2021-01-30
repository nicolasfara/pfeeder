#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2021 Nicolas Farabegoli <nicolas.farabegoli@gmail.com> & Martina Cavallucci <martina.cavallucci11@gmail.com>
#
# Distributed under terms of the MIT license.

"""

"""

import asyncio
import json
from asyncio_mqtt import Client

# TODO("Converti i parametri affinche' siano validi")
payload = {
    "deviceId":"54beb59b38ee99724bd29cd2",
    "petName":"Filippo",
    "quantity": "50",
    "kcal":"500",
    "fodderId":"600742458a1123002467dab8"
}

async def main():
    async with Client("localhost") as client:
        msg = json.dumps(payload)
        await client.publish('/pfeeder/feed', msg, qos=1)



if __name__ == "__main__":
    asyncio.run(main())
