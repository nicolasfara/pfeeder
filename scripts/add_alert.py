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
    "deviceId":"2a19abbcdddcb24596785bb5",
    "message": "The fodder in the dispenser is finished!"
}

async def main():
    async with Client("localhost") as client:
        msg = json.dumps(payload)
        await client.publish('/pfeeder/alert', msg, qos=1)



if __name__ == "__main__":
    asyncio.run(main())