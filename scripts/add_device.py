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
import aiohttp

# TODO("Converti i parametri affinche' siano validi in produzione")
credential={
        "email": "leo.rossi@gmail.com",
        "password": "leonardorossi"
}

async def main():
    base_url="localhost/api"
    async with aiohttp.ClientSession() as session:
        async with session.post(url=f"http://{base_url}/users/login", json=credential) as resp:
            res = await resp.json()
            token = res['token']
        headers={'Authorization': f"Bearer {token}"}
        async with session.post(url=f"http://{base_url}/users/device", headers=headers) as resp:
            device_id = await resp.json()
            print(device_id)
            if resp.status == 200:
                print("Device added successfully")

if __name__ == "__main__":
    asyncio.run(main())
