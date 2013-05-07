# uSMS - Micro Servidor de Mensajes de Texto (SMS)

***

## _uSMS_ es un proyecto OpenSource que funciona como servidor de mensajes de texto (SMS), permite recibir y enviar mensajes usando Modems GSM o teléfonos GSM con esas capacidades.


Entre las principales caracteristicas están:
* Interface web usando Ajax, Dojo y HTML5 para funcionar facilmente en red utilizando cualquier navegador en cualquier sistema operativo.
* Utiliza modems GSM para el envío y recepción de mensajes de texto (SMS) y llamadas telefónicas.
* Directorio de contactos con varios datos entre ellos Geoposicionamiento usando OpenStreetMap (OSM).
* Cantidad ilimitada de contactos (depende de la capacidad del computador).
* Envio de sms masivos.
* Envio de sms programados por fecha y hora.
* Soporta modems en modo PDU y modo texto.
* Puede funcionar en forma totalmente autónoma.
* Utiliza como base de datos PostgreSQL.
* Desarrollado totalmente en Vala.
* Es software libre.

***
_uSMS_ se lo puede usar fácilemnte como base para implementar sistemas de servicios SMS mucho más complejos, como sistemas de encuestas, concursos, registro y consulta de datos, sistemas sms para radio y televisión, etc.

***
El proyecto requiere de ayuda, ya sea económica, con ideas, aportes de codigo, depuración, lo que sea es bienvenido.
***

uSMS depende de las siguientes librerias:

* [libspire_usms](https://github.com/edwinspire/libspire_usms): Librería Base de uSMS.
* [uSMS](https://github.com/edwinspire/usms): uSMS - Micro Servidor de Mensajes de Texto.
* [libspire_pg](https://github.com/edwinspire/libspire_pg): Librería para conexión con PostgreSQL.
* [libspire_uhttp](https://github.com/edwinspire/libspire_uhttp): Librería para crear un micro servidor web para la interface gráfica.
* [libspire_pdu](https://github.com/edwinspire/libspire_pdu): Librería para codificar y decodificar mensajes de texto en formato PDU.
* [libspire_gsm](https://github.com/edwinspire/libspire_gsm): Librería para manejo de modems GSM.
* [libspire_serial](https://github.com/edwinspire/libspire_serial): Librería para comunicación con puertos seriales.


***
### Soporte o Contacto
Puede reportar algún bug en el sistema a:
* edwinspire@gmail.com
* software@edwinspire.com
* usms@edwinspire.com
* o de preferencia a [Issues](https://github.com/edwinspire/usms/issues) para poder hacer un seguimiento y solucionarlo.


Más información la puede encontrar en:
* [Página oficial de EDWINSPIRE] (http://www.edwinspire.com)
* [Página oficial de uSMS - Software](http://www.usms-software.edwinspire.com)
* [Página de Aplicaciones SMS usando uSMS](http://www.aplicaciones-sms.edwinspire.com)
