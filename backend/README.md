| Metodo |              Route              |                  Description                  |        Return       | Authentication type  |
|:------:|:-------------------------------:|:---------------------------------------------:|:-------------------:|----------------------|
|  POST  |         /user/newdevice         |           Aggiunta nuovo dispositivo          |       Api Key       | Local authentication |
|   GET  |            /pets/:id            |    Lista di animali appartenenti ad utente    |      List<Pet>      | Local authentication |
|  POST  |              /pets              |          Aggiunta di un nuovo animale         |   Animale inserito  | Local authentication |
|  PATCH |            /pets/:id            |       Aggiornamento dati  di un animale       |  Animale modificato | Local authentication |
| DELETE |            /pets/:id            |            Rimozione di un animale            |   Animale rimosso   | Local authentication |
|  POST  |         /pets/:id/ration        |            Aggiunta di una razione            |   Razione inserita  | Local authentication |
|   GET  |         /pets/:id/ration        |         Lista di razioni di un animale        |    Lista razioni    | Local authentication |
|  PATCH | /pets/:pet_id/ration/:ration_id |   Aggiornamento di una razione di un animale  |  Razione aggiornata | Local authentication |
| DELETE | /pets/:pet_id/ration/:ration_id |       Eliminazione razione di un animale      |   Razione rimossa   | Local authentication |
|  POST  |         /pets/:id/fodder        |            Aggiunta di un mangime             |   Mangime inserito  | Local authentication |
|   GET  |         /pets/:id/fodder        |          Mangime attuale dell'animale         |   Mangime attuale   | Local authentication |
|  PATCH |         /pets/:id/fodder        |     Aggiornamento del mangime dell'animale    | Mangime aggiornaeto | Local authentication |
|   GET  |          /notification          |     Lista di notifiche dell'utente loggato    |   Lista notifiche   | Local authentication |
|  PATCH |      /notification/:id/read     |      Aggiornamento stato lettura notifica     |    Notifica letta   | Local authentication |
| DELETE |        /notification/:id        |             Cancellazione notifica            |   Notifica rimossa  | Local authentication |
|  POST  |             /fodder             |              Aggiunta di mangime              |   Mangime inserito  | Local authentication |
|  PATCH |           /fodder/:id           |          Aggiornamento di un mangime          |  Mangime aggiornato | Local authentication |
|   GET  |             /fodder             |            Lista di tutti i mangini           |   Lista di mangimi  | Local authentication |
|  POST  |          /feed/:pet_id          |           Aggiunta erogazione pasto           |    Pasto inserito   | Token authentication |
|   GET  |              /feed              | Lista dei pasti di degli animali di un utente |   Lista dei pasti   | Local authentication |
