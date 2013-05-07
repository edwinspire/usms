#!/bin/bash
valac  -d "/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyects/usmsd/bin/lnx"  "/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyects/usmsd/usmsd.vala"  --pkg gee-1.0  --pkg gio-2.0  --pkg libpq -X -lpq  --pkg libxml-2.0  --pkg sqlite3  -X "-L/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyectlibs/lnx"  -X "-I/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyectlibs/lnx"  "/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyectlibs/lnx/libspire_serial.vapi" -X -lspire_serial  "/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyectlibs/lnx/libspire_gsm.vapi" -X -lspire_gsm  "/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyectlibs/lnx/libspire_pg.vapi" -X -lspire_pg  "/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyectlibs/lnx/libspire_usms.vapi" -X -lspire_usms  "/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyectlibs/lnx/libspire_uhttp.vapi" -X -lspire_uhttp  "/home/edwinspire/programacion/ProyectosSoftware/Software Vala/ProyectosVala/proyectlibs/lnx/libspire_pdu.vapi" -X -lspire_pdu  -o usmsd  -D _LNX_SPIRE_   
read
