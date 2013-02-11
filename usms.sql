--
-- PostgreSQL database dump
--

-- Dumped from database version 9.1.7
-- Dumped by pg_dump version 9.1.7
-- Started on 2013-02-11 07:26:36 ECT

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

--
-- TOC entry 282 (class 1255 OID 26815)
-- Dependencies: 811 5
-- Name: ctrl_ts(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION ctrl_ts() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.ts = now(); 
   RETURN NEW;
END;
$$;


--
-- TOC entry 326 (class 1255 OID 27313)
-- Dependencies: 811 5
-- Name: fun_address_edit(integer, text, double precision, double precision, text, text, text, text, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_address_edit(inidaddress integer, inidlocation text, ingeox double precision, ingeoy double precision, inmstreet text, insstreet text, inother text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean, OUT outreturn integer, OUT outpgmsg text) RETURNS record
    LANGUAGE plpgsql
    AS $$BEGIN

outreturn := 0;
outpgmsg := 'Ninguna accion realizada';

CASE

WHEN inidaddress = 0 THEN   
INSERT INTO address (idlocation, geox, geoy, main_street, secundary_street, other, note) VALUES (inidlocation, ingeox, ingeoy, inmstreet, insstreet, inother, innote) RETURNING idaddress INTO outreturn;
outpgmsg := 'Nuevo registro creado, idaddress = '||outreturn::text;

WHEN inidaddress > 0 THEN

IF EXISTS(SELECT * FROM address WHERE idaddress = inidaddress) THEN
UPDATE address SET idlocation = inidlocation, geox = ingeox, geoy = ingeoy, main_street = inmstreet, secundary_street = insstreet, other = inother, note = innote WHERE idaddress = inidaddress RETURNING idaddress INTO outreturn;
outpgmsg := 'Actualizado registro idaddress = '||outreturn::text;
ELSE
outreturn := 0;
outpgmsg := 'El idaddress '||inidaddress::text||' no existe.';
END IF;

WHEN inidaddress < 0 AND EXISTS(SELECT * FROM address WHERE idaddress = abs(inidaddress)) THEN
DELETE FROM address WHERE idaddress = abs(inidaddress);
outreturn := 0;
outpgmsg := 'Eliminado el registro idaddress '|| abs(inidaddress)::text;

ELSE
outreturn := 0;
outpgmsg := 'Ninguna accion realizada';
END CASE;

IF fieldtextasbase64 THEN
outpgmsg := encode(outpgmsg::bytea, 'base64');
END IF;

RETURN;
END;$$;


--
-- TOC entry 327 (class 1255 OID 27314)
-- Dependencies: 5 811
-- Name: fun_address_edit_xml(integer, text, double precision, double precision, text, text, text, text, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_address_edit_xml(inidaddress integer, inidlocation text, ingeox double precision, ingeoy double precision, inmstreet text, insstreet text, inother text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

CursorResultado refcursor;
Retorno TEXT DEFAULT '';

BEGIN
OPEN CursorResultado FOR SELECT * FROM fun_address_edit(inidaddress, inidlocation, ingeox, ingeoy, inmstreet, insstreet, inother, innote, ints, fieldtextasbase64);
SELECT * FROM cursor_to_xml(CursorResultado, 10, false, false, '') INTO Retorno;
CLOSE CursorResultado;
RETURN '<table>'||Retorno||'</table>';
END;$$;


--
-- TOC entry 331 (class 1255 OID 27317)
-- Dependencies: 811 5
-- Name: fun_contact_address_edit(integer, text, double precision, double precision, text, text, text, text, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_contact_address_edit(inidcontact integer, inidlocation text, ingeox double precision, ingeoy double precision, inmstreet text, insstreet text, inother text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean, OUT outreturn integer, OUT outpgmsg text) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
idaddress INTEGER DEFAULT 0;

BEGIN

outreturn := 0;
outpgmsg := 'Ninguna accion realizada';

IF EXISTS(SELECT * FROM contacts WHERE idcontact = abs(inidcontact)) THEN
SELECT contacts.idaddress INTO idaddress FROM contacts WHERE idcontact = abs(inidcontact);

CASE   

WHEN inidcontact < 0 THEN  
-- Seteamos el idaddress = 0 para que el trigger asociado a la tabla contacts elimine automaticamente el idaddress de la tabla address
UPDATE contacts SET idaddress = 0 WHERE idcontact = abs(inidcontact);
outreturn := 0;
outpgmsg := 'Registro de dirección eliminado';

WHEN inidcontact = 0 THEN  
outreturn := 0;
outpgmsg := 'El idaccount = 0 no es válido';

ELSE
SELECT fun_address_edit.outreturn, fun_address_edit.outpgmsg INTO outreturn, outpgmsg FROM fun_address_edit(idaddress, inidlocation, ingeox, ingeoy, inmstreet, insstreet, inother, innote, ints, false);
UPDATE contacts SET idaddress = outreturn WHERE idcontact = inidcontact;
END CASE;

ELSE
outreturn := 0;
outpgmsg := 'El idaccount ='||abs(inidaccount)::text||' no existe.';
END IF;

IF fieldtextasbase64 THEN
outpgmsg := encode(outpgmsg::bytea, 'base64');
END IF;

RETURN;
END;$$;


--
-- TOC entry 2435 (class 0 OID 0)
-- Dependencies: 331
-- Name: FUNCTION fun_contact_address_edit(inidcontact integer, inidlocation text, ingeox double precision, ingeoy double precision, inmstreet text, insstreet text, inother text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean, OUT outreturn integer, OUT outpgmsg text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_contact_address_edit(inidcontact integer, inidlocation text, ingeox double precision, ingeoy double precision, inmstreet text, insstreet text, inother text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean, OUT outreturn integer, OUT outpgmsg text) IS 'Si el idcontact es negativo se elimina el registro de address correspondiente a ese contacto';


--
-- TOC entry 321 (class 1255 OID 27319)
-- Dependencies: 811 5
-- Name: fun_contact_address_edit_xml(integer, text, double precision, double precision, text, text, text, text, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_contact_address_edit_xml(idcontact integer, inidlocation text, ingeox double precision, ingeoy double precision, inmstreet text, insstreet text, inother text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

CursorResultado refcursor;
Retorno TEXT DEFAULT '';

BEGIN
OPEN CursorResultado FOR SELECT * FROM fun_contact_address_edit(idcontact, inidlocation, ingeox, ingeoy, inmstreet, insstreet, inother, innote, ints, fieldtextasbase64);
SELECT * FROM cursor_to_xml(CursorResultado, 10, false, false, '') INTO Retorno;
CLOSE CursorResultado;
RETURN '<table>'||Retorno||'</table>';
END;$$;


--
-- TOC entry 291 (class 1255 OID 26962)
-- Dependencies: 811 5
-- Name: fun_contact_search_by_name(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_contact_search_by_name(infirstname text, inlastname text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
Retorno INTEGER DEFAULT -1;

BEGIN

SELECT idcontact INTO Retorno FROM contacts WHERE upper(trim(firstname)) = upper(trim(infirstname)) AND upper(trim(lastname)) = upper(trim(inlastname)) LIMIT 1;

IF Retorno<1 OR Retorno IS NULL THEN
Retorno := 0;
END IF;

RETURN Retorno;
END;$$;


--
-- TOC entry 2436 (class 0 OID 0)
-- Dependencies: 291
-- Name: FUNCTION fun_contact_search_by_name(infirstname text, inlastname text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_contact_search_by_name(infirstname text, inlastname text) IS 'Obtiene el idcontact segun el firstname y lastname pasado como parametro.
Si no lo encuentra devuelve 0.';


--
-- TOC entry 332 (class 1255 OID 27267)
-- Dependencies: 811 5
-- Name: fun_contacts_edit(integer, boolean, text, text, text, integer, date, integer, text, text, text, text, integer, text, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_contacts_edit(inidcontact integer, inenable boolean, intitle text, infirstname text, inlastname text, ingender integer, inbirthday date, intypeofid integer, inidentification text, inweb text, inemail1 text, inemail2 text, inidaddress integer, innote text, fieldtextasbase64 boolean, OUT outreturn integer, OUT outpgmsg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

internalIdContact INTEGER DEFAULT 0;

BEGIN

-- Obtenemos el idcontact segun el nombre ingresado
internalIdContact := fun_contact_search_by_name(infirstname, inlastname);

CASE
-- Actualizamos cuando inidcontact es mayor que 0 y ademas ese id existe
	WHEN inidcontact > 0 AND EXISTS(SELECT * FROM contacts WHERE idcontact = inidcontact) THEN

IF internalIdContact = inidcontact OR internalIdContact < 1 THEN
UPDATE contacts SET enable = inenable, title = intitle, firstname =infirstname, lastname = inlastname, gender = ingender, birthday = inbirthday, typeofid = intypeofid, identification = inidentification, web = inweb, email1 = inemail1, email2 = inemail2, note = innote, idaddress = inidaddress WHERE idcontact = inidcontact RETURNING idcontact INTO outreturn;
outpgmsg := 'idcontact '||inidcontact::text||' actualizado.';
ELSE
outreturn := inidcontact;
outpgmsg := 'El nombre '||infirstname::text||' '||inlastname::text||' ya existe, utilice otro nombre';
END IF;

-- Insertamos un nuevo registro
	WHEN inidcontact = 0 THEN

IF internalIdContact < 1 THEN
-- idaddress se pone a 0 inicialmente porque al crear un contacto se supone que no exise direccion asiciada a el. 
-- Se lo hace para prevenir que por algun motivo se vaya a usar el idaddress que ya este siendo usado por otro.
INSERT INTO contacts (enable, title, firstname, lastname, gender, birthday, typeofid, identification, web, email1, email2, note, idaddress) VALUES (inenable, intitle, infirstname, inlastname, ingender, inbirthday, intypeofid, inidentification, inweb, inemail1, inemail2, innote, 0) RETURNING idcontact INTO outreturn;
outpgmsg := 'idcontact '||outreturn::text||' creado.';
ELSE
outreturn := -1;
outpgmsg := 'El nombre '||infirstname::text||' '||inlastname::text||' ya existe, utilice otro nombre';
END IF;

	WHEN inidcontact < 0 THEN

--PERFORM fun_contact_address_edit(inidcontact, '', 0, 0, '', '', '', '', '1900-01-01', FALSE);
-- Seteamos a 0 el idaddress de la tabla contacts para asegurarnos que ese idaddress sea eliminado de la tabla address
UPDATE contacts SET idaddress = 0 WHERE idcontact = abs(inidcontact);
DELETE FROM contacts WHERE idcontact = abs(inidcontact);
outreturn := abs(inidcontact);
outpgmsg := 'idcontact '||inidcontact::text||' eliminado.';


	END CASE;

IF fieldtextasbase64 THEN
outpgmsg := encode(outpgmsg::bytea, 'base64');
END IF;

RETURN;
END;$$;


--
-- TOC entry 320 (class 1255 OID 27268)
-- Dependencies: 811 5
-- Name: fun_contacts_edit_xml(integer, boolean, text, text, text, integer, date, integer, text, text, text, text, integer, text, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_contacts_edit_xml(inidcontact integer, inenable boolean, intitle text, infirstname text, inlastname text, ingender integer, inbirthday date, intypeofid integer, inidentification text, inweb text, inemail1 text, inemail2 text, inidaddress integer, innote text, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

CursorResultado refcursor;
Retorno TEXT DEFAULT '';

BEGIN
--fun_contacts_table_xml(IN inidcontact integer, IN inenable boolean, IN intitle text, IN infirstname text, IN inlastname text, IN ingender integer, IN inbirthday date, IN intypeofid integer, IN inidentification text, IN inweb text, IN inemail1 text, IN inemail2 text, IN inidaddress text, IN note text)

OPEN CursorResultado FOR SELECT * FROM fun_contacts_edit(inidcontact, inenable, intitle, infirstname, inlastname, ingender, inbirthday, intypeofid, inidentification, inweb, inemail1, inemail2, inidaddress, innote, fieldtextasbase64);
SELECT * FROM cursor_to_xml(CursorResultado, 10, false, false, '') INTO Retorno;
CLOSE CursorResultado;
RETURN '<table>'||Retorno||'</table>';
END;$$;


--
-- TOC entry 255 (class 1255 OID 16818)
-- Dependencies: 5 811
-- Name: fun_correntportproviders_get_idprovider(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_correntportproviders_get_idprovider(inidport integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
Retorno INTEGER DEFAULT 0;

BEGIN

SELECT idprovider INTO Retorno FROM currentportsproviders WHERE idport = inidport;

IF Retorno < 1 OR Retorno IS NULL THEN
Retorno := 0;
END IF;

RETURN Retorno;
END;$$;


--
-- TOC entry 2437 (class 0 OID 0)
-- Dependencies: 255
-- Name: FUNCTION fun_correntportproviders_get_idprovider(inidport integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_correntportproviders_get_idprovider(inidport integer) IS 'Obtiene el idprovider desde la tabla currentportsproviders segun el idport pasado como parametro.';


--
-- TOC entry 265 (class 1255 OID 16714)
-- Dependencies: 811 5
-- Name: fun_currentportsproviders_insertupdate(integer, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_currentportsproviders_insertupdate(inidport integer, inport text, incimi text, inimei text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
internalidprovider integer DEFAULT 0;
Retorno integer DEFAULT 0;
internalidmodem integer DEFAULT 0;

BEGIN

-- Usando el incimi tratamos de obtener el idprovider de la tabla provider
SELECT idprovider INTO internalidprovider FROM provider WHERE cimi = incimi;

-- Usando el inimei tratamos de obtener el idmodem de la tabla modem
SELECT idmodem INTO internalidmodem FROM modem WHERE imei = inimei;

IF internalidmodem IS NULL OR internalidmodem < 1 THEN
internalidmodem := 0;
END IF;

IF internalidprovider IS NULL THEN
-- El cimi no existe, lo creamos en la tabla providers
INSERT INTO provider (enable, cimi, name, note) VALUES (false, incimi, 'Undefined', 'No exitia previamente este cimi asi que fue creado automaticamente por usmsd') RETURNING idprovider INTO internalidprovider;
END IF;

IF EXISTS(SELECT idprovider FROM currentportsproviders WHERE idport = inidport) THEN
UPDATE currentportsproviders SET idmodem = internalidmodem, port = inport, cimi = incimi, imei = inimei, idprovider = internalidprovider, lastupdate = now() WHERE idport = inidport RETURNING idport INTO Retorno;
ELSE
-- No existe el registro, creamos uno nuevo
INSERT INTO currentportsproviders (idport, port, cimi, imei, idprovider, lastupdate, idmodem) VALUES (inidport, inport, incimi, inimei, internalidprovider, now(), internalidmodem) RETURNING idport INTO Retorno;
END IF;


-- Eliminamos todos los registros que tienen el campo lastupdate con mas de 2 minutos en relacion a la fecha actual
 DELETE FROM currentportsproviders WHERE (now()- lastupdate) > '0:02:00';
RETURN Retorno;
END;$$;


--
-- TOC entry 2438 (class 0 OID 0)
-- Dependencies: 265
-- Name: FUNCTION fun_currentportsproviders_insertupdate(inidport integer, inport text, incimi text, inimei text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_currentportsproviders_insertupdate(inidport integer, inport text, incimi text, inimei text) IS 'Funcion que inserta o actualiza los datos de la tabla currentportsproviders con datos enviados desde el puerto serial.';


--
-- TOC entry 267 (class 1255 OID 25899)
-- Dependencies: 811 5
-- Name: fun_idphone_from_phone(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_idphone_from_phone(inphone text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno INTEGER DEFAULT 0;

BEGIN

IF char_length(inphone) > 0 THEN
-- Obtenemos el phone 
SELECT idphone INTO Retorno FROM phones WHERE phone = inphone;
IF Retorno IS NULL THEN
Retorno := 0;
END IF;
END IF;


RETURN Retorno;
END;$$;


--
-- TOC entry 2439 (class 0 OID 0)
-- Dependencies: 267
-- Name: FUNCTION fun_idphone_from_phone(inphone text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_idphone_from_phone(inphone text) IS 'Obtenemos el idphone segun el phone pasado como parametro';


--
-- TOC entry 248 (class 1255 OID 16846)
-- Dependencies: 5 811
-- Name: fun_incomingcalls_insert(timestamp without time zone, integer, integer, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_incomingcalls_insert(indatecall timestamp without time zone, inidport integer, incalaction integer, inphone text, innote text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
Retorno INTEGER DEFAULT 0;
inidphone INTEGER DEFAULT 0;
-- TODO: Hay que agregar el campo idmodem
BEGIN
-- Buscamos si ya existe una llamada desde ese mismo numero anteriormente para ignorarlo.
-- La idea es registrar una llamada y no registrar cada ring
SELECT idincall INTO Retorno FROM incomingcalls WHERE ('now()' - datecall) < '00:00:20' AND phone = inphone;

IF Retorno < 1 OR Retorno IS NULL THEN

---SELECT fun_idphone_from_phone('1234'); 
inidphone := fun_idphone_from_phone(inphone);
INSERT INTO incomingcalls (datecall, idport, idphone, callaction, phone, note) VALUES (indatecall, inidport, inidphone, incalaction, inphone, innote) RETURNING idincall INTO Retorno;

IF Retorno < 1 OR Retorno IS NULL THEN
Retorno := 0;
END IF;

END IF;

RETURN Retorno;
END;$$;


--
-- TOC entry 2440 (class 0 OID 0)
-- Dependencies: 248
-- Name: FUNCTION fun_incomingcalls_insert(indatecall timestamp without time zone, inidport integer, incalaction integer, inphone text, innote text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_incomingcalls_insert(indatecall timestamp without time zone, inidport integer, incalaction integer, inphone text, innote text) IS 'Registra las llamadas entrantes provenientes de los modems';


--
-- TOC entry 256 (class 1255 OID 16847)
-- Dependencies: 5 811
-- Name: fun_incomingcalls_insert_online(integer, integer, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_incomingcalls_insert_online(inidport integer, incallaction integer, inphone text, innote text) RETURNS integer
    LANGUAGE plpgsql
    AS $$BEGIN 
RETURN fun_incomingcalls_insert('now()', inidport, incallaction, inphone, innote); 
END;$$;


--
-- TOC entry 2441 (class 0 OID 0)
-- Dependencies: 256
-- Name: FUNCTION fun_incomingcalls_insert_online(inidport integer, incallaction integer, inphone text, innote text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_incomingcalls_insert_online(inidport integer, incallaction integer, inphone text, innote text) IS 'Funcion para insertar la fecha en modo online, registra la llamada con la fecha actual.';


--
-- TOC entry 257 (class 1255 OID 17669)
-- Dependencies: 811 5
-- Name: fun_modem_insert(text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_modem_insert(inimei text, inmanufacturer text, inmodel text, inrevision text, innote text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
Retorno INTEGER DEFAULT 0;
BEGIN

-- Verificamos que no exista ese imei
IF NOT EXISTS(SELECT idmodem FROM modem WHERE imei = inimei) THEN
INSERT INTO modem (imei, manufacturer, model, revision, note) VALUES (inimei, inmanufacturer, inmodel, inrevision, innote) RETURNING idmodem INTO Retorno;
END IF;


RETURN Retorno;
END;$$;


--
-- TOC entry 2442 (class 0 OID 0)
-- Dependencies: 257
-- Name: FUNCTION fun_modem_insert(inimei text, inmanufacturer text, inmodel text, inrevision text, innote text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_modem_insert(inimei text, inmanufacturer text, inmodel text, inrevision text, innote text) IS 'Inserta los datos de un modem';


--
-- TOC entry 266 (class 1255 OID 25896)
-- Dependencies: 811 5
-- Name: fun_phone_from_idphone(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_phone_from_idphone(inidphone integer) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';

BEGIN

IF inidphone>0 THEN
-- Obtenemos el phone 
SELECT phone INTO Retorno FROM phones WHERE idphone = inidphone;
IF Retorno IS NULL THEN
Retorno := '';
END IF;
END IF;


RETURN Retorno;
END;$$;


--
-- TOC entry 2443 (class 0 OID 0)
-- Dependencies: 266
-- Name: FUNCTION fun_phone_from_idphone(inidphone integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_phone_from_idphone(inidphone integer) IS 'Obtiene el numero telefonico desde la tabla phones segun el idphone';


--
-- TOC entry 268 (class 1255 OID 25900)
-- Dependencies: 5 811
-- Name: fun_phone_idphone_check(integer, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_phone_idphone_check(inidphone integer, inphone text, OUT outidphone integer, OUT outphone text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE
retorno INTEGER DEFAULT -1; 

BEGIN

-- Verificamos que los datos sea validos 
IF char_length(inphone) > 0 OR  inidphone > 0 THEN

IF inidphone>0 THEN
-- Si se pasa el idphone como parametro se obtiene el phone desde la tabla phones segun ese id
outidphone := inidphone;
outphone := fun_phone_from_idphone(outidphone);

ELSE
-- Si inidphone <= 0 tratamos de obtenerlo usando el inphone
outphone := inphone;
outidphone := fun_idphone_from_phone(outphone);
END IF;

ELSE
-- Valores vacios
outphone := 0;
outidphone := '';

END IF;

RETURN;
END;$$;


--
-- TOC entry 294 (class 1255 OID 26980)
-- Dependencies: 5 811
-- Name: fun_phone_search_by_number(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_phone_search_by_number(inphone text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
Retorno INTEGER DEFAULT -1;

BEGIN

SELECT idphone INTO Retorno FROM phones WHERE upper(trim(phone)) = upper(trim(inphone)) LIMIT 1;

IF Retorno<1 OR Retorno IS NULL THEN
Retorno := 0;
END IF;

RETURN Retorno;
END;$$;


--
-- TOC entry 2444 (class 0 OID 0)
-- Dependencies: 294
-- Name: FUNCTION fun_phone_search_by_number(inphone text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_phone_search_by_number(inphone text) IS 'Busca el id segun el numero telefonico';


--
-- TOC entry 250 (class 1255 OID 27318)
-- Dependencies: 811 5
-- Name: fun_phones_address_edit(integer, text, double precision, double precision, text, text, text, text, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_phones_address_edit(inidphone integer, inidlocation text, ingeox double precision, ingeoy double precision, inmstreet text, insstreet text, inother text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean, OUT outreturn integer, OUT outpgmsg text) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
idaddress INTEGER DEFAULT 0;

BEGIN

outreturn := 0;
outpgmsg := 'Ninguna accion realizada.';

IF EXISTS(SELECT * FROM phones WHERE idphone = abs(inidphone)) THEN
SELECT phones.idaddress INTO idaddress FROM phones WHERE idphone = abs(inidphone);

CASE   

WHEN inidphone < 0 THEN  
UPDATE phones SET idaddress = 0 WHERE idphone = abs(inidphone);
outreturn := 0;
outpgmsg := 'Dirección del teléfono eliminada';
WHEN inidphone = 0 THEN  
outreturn := 0;
outpgmsg := 'El inidphone = 0 no es válido';

ELSE

SELECT fun_address_edit.outreturn, fun_address_edit.outpgmsg INTO outreturn, outpgmsg FROM fun_address_edit(idaddress, inidlocation, ingeox, ingeoy, inmstreet, insstreet, inother, innote, ints, false);
UPDATE phones SET idaddress = outreturn WHERE idphone = inidphone;

END CASE;

ELSE
outreturn := 0;
outpgmsg := 'El inidphone = '||abs(inidphone)::text||' no existe.';
END IF;

IF fieldtextasbase64 THEN
outpgmsg := encode(outpgmsg::bytea, 'base64');
END IF;

RETURN;
END;$$;


--
-- TOC entry 322 (class 1255 OID 27320)
-- Dependencies: 811 5
-- Name: fun_phones_address_edit_xml(integer, text, double precision, double precision, text, text, text, text, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_phones_address_edit_xml(idphone integer, inidlocation text, ingeox double precision, ingeoy double precision, inmstreet text, insstreet text, inother text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

CursorResultado refcursor;
Retorno TEXT DEFAULT '';

BEGIN
OPEN CursorResultado FOR SELECT * FROM fun_phones_address_edit(idphone, inidlocation, ingeox, ingeoy, inmstreet, insstreet, inother, innote, ints, fieldtextasbase64);
SELECT * FROM cursor_to_xml(CursorResultado, 10, false, false, '') INTO Retorno;
CLOSE CursorResultado;
RETURN '<table>'||Retorno||'</table>';
END;$$;


--
-- TOC entry 333 (class 1255 OID 27274)
-- Dependencies: 5 811
-- Name: fun_phones_table(integer, integer, boolean, text, integer, integer, text, integer, integer, text, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_phones_table(inidphone integer, inidcontact integer, inenable boolean, inphone text, intypephone integer, inidprovider integer, inphone_ext text, inidaddress integer, inubiphone integer, innote text, fieldtextasbase64 boolean, OUT outreturn integer, OUT outpgmsg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

InternalIdPhone INTEGER DEFAULT 0;

BEGIN

IF length(inphone) > 0 THEN

IF EXISTS(SELECT * FROM contacts WHERE idcontact = inidcontact)  THEN
--
InternalIdPhone := fun_phone_search_by_number(inphone);

CASE

	WHEN inidphone = 0 THEN
	
	IF InternalIdPhone < 1 THEN
	-- idaddress se ingresa siempre a 0 al crear un telefono para evitar que se vaya a usar un idaddress que ya este siendo usado.
	INSERT INTO phones (idcontact, enable, phone, typephone, idprovider, note, idaddress, phone_ext, ubiphone) VALUES (inidcontact, inenable, inphone, intypephone, inidprovider, innote, 0, inphone_ext, inubiphone) RETURNING idphone INTO outreturn;
	outpgmsg := 'Nuevo telefono ingresado';
	ELSE
	outpgmsg := 'El numero telefonico ingresado ya existe, debe ingresar uno diferente';
	outreturn := -1;
	END IF;

	WHEN inidphone > 0 AND EXISTS(SELECT * FROM phones WHERE idphone = inidphone) THEN
	
	IF InternalIdPhone < 1 OR InternalIdPhone = inidphone THEN
	UPDATE phones SET idcontact = inidcontact, enable = inenable, phone = inphone, typephone = intypephone, idprovider = inidprovider, note = innote, idaddress = inidaddress, phone_ext = inphone_ext, ubiphone = inubiphone WHERE idphone = inidphone RETURNING  idphone INTO outreturn;
	outpgmsg := 'Telefono actualizado';
	ELSE
	outpgmsg := 'El numero telefonico ingresado ya existe, debe ingresar uno diferente';
	outreturn := -2;
	END IF;

	WHEN inidphone < 0 THEN
	-- Seteamos el idaddress = 0 para que se elimine el registro de la tabla address
	UPDATE phones SET idaddress = 0 WHERE idphone = abs(inidphone);
	DELETE FROM phones WHERE idphone = abs(inidphone);
	outpgmsg := 'Telefono eliminado';
	outreturn := 0;
END CASE;

ELSE
outreturn := -1;
outpgmsg := 'El contacto no existe';
END IF;

ELSE
outreturn := -1;
outpgmsg := 'El numero no puede estar vacio';
END IF;

IF fieldtextasbase64 THEN
outpgmsg := encode(outpgmsg::bytea, 'base64');
END IF;

RETURN;
END;$$;


--
-- TOC entry 324 (class 1255 OID 27275)
-- Dependencies: 5 811
-- Name: fun_phones_table_xml(integer, integer, boolean, text, integer, integer, text, integer, integer, text, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_phones_table_xml(inidphone integer, inidcontact integer, inenable boolean, inphone text, intypephone integer, inidprovider integer, inphone_ext text, inidaddress integer, inubiphone integer, innote text, ts timestamp without time zone, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

CursorResultado refcursor;
Retorno TEXT DEFAULT '';

BEGIN

OPEN CursorResultado FOR SELECT * FROM fun_phones_table(inidphone, inidcontact, inenable, inphone, intypephone, inidprovider, inphone_ext, inidaddress, inubiphone, innote, fieldtextasbase64);
SELECT * FROM cursor_to_xml(CursorResultado, 10, false, false, '') INTO Retorno;
CLOSE CursorResultado;
RETURN '<table>'||Retorno||'</table>';

END;$$;


--
-- TOC entry 262 (class 1255 OID 17670)
-- Dependencies: 5 811
-- Name: fun_portmodem_update(integer, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_portmodem_update(inidport integer, inport text, incimi text, inimei text, inmanufacturer text, inmodel text, inrevision text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$DECLARE
internalidprovider integer DEFAULT 0;
Retorno integer DEFAULT 0;

BEGIN
-- Inserta los datos del modem si no existe
PERFORM fun_modem_insert(inimei, inmanufacturer, inmodel, inrevision, '');
-- Mantiene actualizada la tabla currentportsproviders 
PERFORM fun_currentportsproviders_insertupdate(inidport, inport, incimi, inimei); 
RETURN TRUE;
END;$$;


--
-- TOC entry 2445 (class 0 OID 0)
-- Dependencies: 262
-- Name: FUNCTION fun_portmodem_update(inidport integer, inport text, incimi text, inimei text, inmanufacturer text, inmodel text, inrevision text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_portmodem_update(inidport integer, inport text, incimi text, inimei text, inmanufacturer text, inmodel text, inrevision text) IS 'Actualiza los registros del puerto y del modem que esta usando la base de datos.';


--
-- TOC entry 307 (class 1255 OID 27040)
-- Dependencies: 5 811
-- Name: fun_provider_edit(integer, boolean, text, text, text, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_provider_edit(inidprovider integer, inenable boolean, incimi text, inname text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean, OUT outreturn integer, OUT outpgmsg text) RETURNS record
    LANGUAGE plpgsql
    AS $$DECLARE

ValidData BOOLEAN DEFAULT false;

BEGIN

-- Validamos que los campos no esten vacios
IF inidprovider >= 0 AND length(incimi) > 0 AND length(inname) > 0 THEN
ValidData := TRUE;

ELSE
outpgmsg := 'Los campos CIMI y NAME no pueden estar vacios';
outreturn := -1;
END IF;

CASE

	WHEN inidprovider = 0  THEN
-- Ingresamos un nuevo registro
IF ValidData THEN
INSERT INTO provider (enable, cimi, name, note) VALUES (inenable, incimi, inname, innote) RETURNING idprovider INTO outreturn;
outpgmsg := 'Nuevo proveedor registrado';
END IF;

	WHEN inidprovider > 0  THEN
-- Actualizamos
IF ValidData THEN
UPDATE provider SET enable = inenable, cimi = incimi, name = inname, note = innote WHERE idprovider = inidprovider RETURNING idprovider INTO outreturn;
outpgmsg := 'Proveedor actualizado';
END IF;

	WHEN inidprovider < 0  THEN
-- Eliminamos
DELETE FROM provider WHERE idprovider = abs(inidprovider);
outpgmsg := 'Proveedor eliminado';
END CASE;


IF fieldtextasbase64 THEN
outpgmsg := encode(outpgmsg::bytea, 'base64');
END IF;
RETURN;
END;$$;


--
-- TOC entry 306 (class 1255 OID 27039)
-- Dependencies: 5 811
-- Name: fun_provider_edit_xml(integer, boolean, text, text, text, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_provider_edit_xml(inidprovider integer, inenable boolean, incimi text, inname text, innote text, ints timestamp without time zone, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

CursorResultado refcursor;
Retorno TEXT DEFAULT '';

BEGIN

OPEN CursorResultado FOR SELECT * FROM fun_provider_edit(inidprovider, inenable , incimi, inname , innote,  ints, fieldtextasbase64);
SELECT * FROM cursor_to_xml(CursorResultado, 10, false, false, '') INTO Retorno;
CLOSE CursorResultado;
RETURN '<table>'||Retorno||'</table>';
END;$$;


--
-- TOC entry 296 (class 1255 OID 26982)
-- Dependencies: 5 811
-- Name: fun_providers_idname_xml(boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_providers_idname_xml(fieldtextasbase64 boolean DEFAULT true) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN
IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idprovider, enable, encode(name::bytea, 'base64') AS name FROM provider;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT idcontact, enable, name FROM provider;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';

END;$$;


--
-- TOC entry 2446 (class 0 OID 0)
-- Dependencies: 296
-- Name: FUNCTION fun_providers_idname_xml(fieldtextasbase64 boolean); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_providers_idname_xml(fieldtextasbase64 boolean) IS 'Devuelve la lista de proveedores unicamente los campos id y name';


--
-- TOC entry 254 (class 1255 OID 16828)
-- Dependencies: 811 5
-- Name: fun_smsin_insert(integer, integer, timestamp without time zone, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_smsin_insert(inidport integer, instatus integer, indatesms timestamp without time zone, inphone text, inmsj text, innote text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno INTEGER DEFAULT 0;
inidprovider INTEGER DEFAULT 0;
inidphone INTEGER DEFAULT 0;

BEGIN

-- Buscamos el idprovider segun el inidport ingresado
inidprovider := fun_correntportproviders_get_idprovider(inidport);
-- Buscamos el idphone segun el numero telefonico ingresado
inidphone := fun_idphone_from_phone(inphone);

INSERT INTO smsin (idport, idprovider, idphone, datesms, status, phone, message) VALUES (inidport, inidprovider, inidphone, indatesms, instatus, inphone, inmsj) RETURNING idsmsin INTO Retorno;

IF Retorno < 1 OR Retorno IS NULL THEN
Retorno := 0;
END IF;

RETURN Retorno;

END;$$;


--
-- TOC entry 2447 (class 0 OID 0)
-- Dependencies: 254
-- Name: FUNCTION fun_smsin_insert(inidport integer, instatus integer, indatesms timestamp without time zone, inphone text, inmsj text, innote text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_smsin_insert(inidport integer, instatus integer, indatesms timestamp without time zone, inphone text, inmsj text, innote text) IS 'Funcion para almacenar sms entrantes en la tabla smsin';


--
-- TOC entry 269 (class 1255 OID 16800)
-- Dependencies: 5 811
-- Name: fun_smsout_insert(integer, integer, integer, integer, text, timestamp without time zone, text, boolean, integer, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_smsout_insert(inidprovider integer, inidsmstype integer, inidphone integer, inpriority integer, inphone text, indatetosend timestamp without time zone, inmessage text, inenablemsgclass boolean, inmsgclass integer, innote text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
retorno INTEGER DEFAULT 0; 
internalPhone TEXT DEFAULT '';
internalidPhone INTEGER DEFAULT 0;

BEGIN

SELECT outidphone, outphone INTO internalidPhone, internalPhone FROM fun_phone_idphone_check(inidphone, inphone);

IF char_length(internalPhone) < 1 AND internalidPhone < 1 THEN
-- No hay valores validos, no es posible insertar
retorno := -1;

ELSE

-- Tratamos de obtener el idprovider si no se lo ha proveido
IF inidprovider < 1 THEN
SELECT idprovider INTO inidprovider FROM phones WHERE idphone = internalidPhone;
-- Pone el idprovider a 0, lo que hace que el sistema intente con cada proveedor hasta lograr enviar el sms.
IF inidprovider IS NULL THEN inidprovider := 0;  END IF;
END IF;

INSERT INTO smsout (idprovider, idsmstype, priority, idphone, phone, datetosend, message, note) VALUES (inidprovider, inidsmstype, inpriority, internalidPhone, internalPhone, indatetosend, inmessage, innote) RETURNING idsmsout INTO retorno;

-- Verificamos que el numero no exista en la lista negra, si existe seteamos process como destino no permitodo
IF EXISTS(SELECT idbl FROM blacklist WHERE idprovider = inidprovider AND idphone = internalidPhone) THEN
UPDATE smsout SET dateprocess = now(), process = 4 WHERE idsmsout = retorno;
END IF;

-- TODO 
-- Si es necesario implementar uso de lista blanca

END IF;


RETURN retorno;
END;$$;


--
-- TOC entry 2448 (class 0 OID 0)
-- Dependencies: 269
-- Name: FUNCTION fun_smsout_insert(inidprovider integer, inidsmstype integer, inidphone integer, inpriority integer, inphone text, indatetosend timestamp without time zone, inmessage text, inenablemsgclass boolean, inmsgclass integer, innote text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_smsout_insert(inidprovider integer, inidsmstype integer, inidphone integer, inpriority integer, inphone text, indatetosend timestamp without time zone, inmessage text, inenablemsgclass boolean, inmsgclass integer, innote text) IS 'Ingresa un sms en la tabla smsout haciendo chequeos previos.
Devuelve:
-1 Si no se ha ingresado inphone e idphone <1';


--
-- TOC entry 261 (class 1255 OID 17668)
-- Dependencies: 5 811
-- Name: fun_smsout_insert_sendnow(integer, integer, integer, integer, text, text, boolean, integer, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_smsout_insert_sendnow(inidprovider integer, inidsmstype integer, inidphone integer, inpriority integer, inphone text, inmessage text, inenablemsgclass boolean, inmsgclass integer, innote text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
retorno INTEGER DEFAULT -1; 

BEGIN
retorno := fun_smsout_insert(inidprovider, inidsmstype, inidphone, inpriority, inphone, 'now()', inmessage, inenablemsgclass, inmsgclass, innote);
RETURN retorno;
END;$$;


--
-- TOC entry 2449 (class 0 OID 0)
-- Dependencies: 261
-- Name: FUNCTION fun_smsout_insert_sendnow(inidprovider integer, inidsmstype integer, inidphone integer, inpriority integer, inphone text, inmessage text, inenablemsgclass boolean, inmsgclass integer, innote text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_smsout_insert_sendnow(inidprovider integer, inidsmstype integer, inidphone integer, inpriority integer, inphone text, inmessage text, inenablemsgclass boolean, inmsgclass integer, innote text) IS 'Ingresa un sms en la tabla smsout haciendo chequeos previos.';


--
-- TOC entry 258 (class 1255 OID 17665)
-- Dependencies: 5 811
-- Name: fun_smsout_preparenewsmsautoprovider(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_smsout_preparenewsmsautoprovider() RETURNS boolean
    LANGUAGE plpgsql
    AS $$DECLARE

CursorNewSMSAutoprovider CURSOR FOR SELECT * FROM public.smsout WHERE datetosend<=now() AND idprovider = 0 AND process = 0;
SMSOUTROWDATA   public.smsout%ROWTYPE;
FirstCurrentIdPort INTEGER DEFAULT 0; 

BEGIN

SELECT idport INTO FirstCurrentIdPort FROM  currentportsproviders ORDER BY idport LIMIT 1;

-- Obtenemos todos los smsout que tienen autoproveedor y debes ser ya enviados, los marcamos como autoprovider y con el primer puerto registrado actualmente
    OPEN CursorNewSMSAutoprovider;
    loop    

        FETCH CursorNewSMSAutoprovider INTO SMSOUTROWDATA;
        EXIT WHEN NOT FOUND;
UPDATE smsout SET process = 5, idport = FirstCurrentIdPort, dateprocess = now()  WHERE idsmsout = SMSOUTROWDATA.idsmsout;
    end loop;
    CLOSE CursorNewSMSAutoprovider;

RETURN TRUE;
END;$$;


--
-- TOC entry 2450 (class 0 OID 0)
-- Dependencies: 258
-- Name: FUNCTION fun_smsout_preparenewsmsautoprovider(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_smsout_preparenewsmsautoprovider() IS 'Prepara para enviar los smsout nuevos que han sido marcados como autoproveedor';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 173 (class 1259 OID 16579)
-- Dependencies: 2232 2233 2234 2235 2236 2237 2238 2239 2240 2241 2242 2243 2244 2245 2246 2247 2248 2249 2250 2251 2252 2253 2254 2255 2256 2257 2258 2259 5 1744 1744
-- Name: smsout; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE smsout (
    idsmsout bigint NOT NULL,
    dateload timestamp without time zone DEFAULT now() NOT NULL,
    idprovider integer DEFAULT 0 NOT NULL,
    idsmstype integer DEFAULT 0 NOT NULL,
    idphone integer DEFAULT 0 NOT NULL,
    phone text DEFAULT ''::text NOT NULL,
    datetosend timestamp without time zone DEFAULT now() NOT NULL,
    dateprocess timestamp without time zone DEFAULT now() NOT NULL,
    process integer DEFAULT 0 NOT NULL,
    note text COLLATE pg_catalog."es_EC.utf8" DEFAULT ''::text NOT NULL,
    priority integer DEFAULT 5,
    attempts integer DEFAULT 0,
    idprovidersent integer DEFAULT 0,
    slices integer DEFAULT 0,
    slicessent integer DEFAULT 0,
    messageclass integer DEFAULT 1 NOT NULL,
    report boolean DEFAULT false,
    maxslices integer DEFAULT 1 NOT NULL,
    enablemessageclass boolean DEFAULT false NOT NULL,
    idport integer DEFAULT 0 NOT NULL,
    flag1 integer DEFAULT 0 NOT NULL,
    flag2 integer DEFAULT 0 NOT NULL,
    flag3 integer DEFAULT 0 NOT NULL,
    flag4 integer DEFAULT 0 NOT NULL,
    flag5 integer DEFAULT 0 NOT NULL,
    retryonfail integer DEFAULT 0 NOT NULL,
    maxtimelive integer DEFAULT 2 NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL,
    message text COLLATE pg_catalog."es_EC.utf8" DEFAULT ''::text NOT NULL
);


--
-- TOC entry 2451 (class 0 OID 0)
-- Dependencies: 173
-- Name: TABLE smsout; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE smsout IS 'Tabla de mensajes salientes';


--
-- TOC entry 2452 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN smsout.idsmstype; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsout.idsmstype IS 'Estado del envio del sms';


--
-- TOC entry 2453 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN smsout.idphone; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsout.idphone IS 'Se es identificado el numero con un idphone se escribe este campo';


--
-- TOC entry 2454 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN smsout.phone; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsout.phone IS 'Numero telefonico';


--
-- TOC entry 2455 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN smsout.datetosend; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsout.datetosend IS 'Fecha programada de envio';


--
-- TOC entry 2456 (class 0 OID 0)
-- Dependencies: 173
-- Name: COLUMN smsout.priority; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsout.priority IS 'Prioridad de envio del sms. 5 es el valor de fabrica. 0 es la maxima prioridad.';


--
-- TOC entry 270 (class 1255 OID 16715)
-- Dependencies: 5 689 811
-- Name: fun_smsout_to_send(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_smsout_to_send(inidport integer DEFAULT 0) RETURNS smsout
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno smsout%ROWTYPE;
idlockedsmsout INTEGER DEFAULT 0;
inidprovider INTEGER DEFAULT 0;
internalPhone TEXT DEFAULT '';
internalidPhone INTEGER DEFAULT 0;

SMSOutOpciones smsoutoptions%ROWTYPE;

BEGIN

-- Marcamos como expirados los sms que han sobrepasado su tiempo de vida
PERFORM fun_smsout_update_expired();

-- Preparamos los smsout marcados como autoproveedor
PERFORM fun_smsout_preparenewsmsautoprovider();

-- Selecionamos los datos desde smsoutoptions
SELECT * INTO SMSOutOpciones FROM fun_smsoutoptions_current();

--LISTEN mymessage;
--PERFORM pg_notify('mymessage', inidport::text);

-- Seleccionamos el inidprovider para el inidport pasado como parametro, si existe devolvera un valor > 0
SELECT idprovider INTO inidprovider FROM currentportsproviders WHERE idport = inidport;

-- SECCION selecciona un sms para enviar segun el Proveedor que corresponde a este puerto y setea los valores de smsoutoptions registradas en este momento
IF inidprovider > 0 THEN
UPDATE smsout SET maxtimelive = SMSOutOpciones.maxtimelive, retryonfail = SMSOutOpciones.retryonfail, report = SMSOutOpciones.report, dateprocess = now(), maxslices = SMSOutOpciones.maxslices, process=1, idport = inidport WHERE idsmsout = (SELECT idsmsout FROM smsout WHERE datetosend <= now() AND ((idprovider = inidprovider AND process IN(0, 10) ) OR (idprovider = 0 AND process = 5 AND idport = inidport) ) ORDER BY datetosend, priority LIMIT 1) RETURNING idsmsout INTO idlockedsmsout;

IF idlockedsmsout > 0 THEN
-- Verificamos idphone y phone
SELECT idphone, phone INTO internalidPhone, internalPhone FROM smsout WHERE idsmsout = idlockedsmsout;

SELECT outidphone, outphone INTO internalidPhone, internalPhone FROM fun_phone_idphone_check(internalidPhone, internalPhone);
-- TODO: chequear adicionalmente que solo haya numeros, + como caracteres
IF char_length(internalPhone) > 0 THEN
UPDATE smsout SET idphone=internalidPhone, phone = internalPhone WHERE idsmsout = idlockedsmsout RETURNING idsmsout INTO idlockedsmsout;

ELSE
-- El phone es invalido
UPDATE smsout SET idphone=internalidPhone, phone = internalPhone, process = 11 WHERE idsmsout = idlockedsmsout;
idlockedsmsout := 0;
END IF;

END IF;


END IF;


-- Obtenemos el ultimo registro para enviar con este proveedor
SELECT * INTO Retorno FROM smsout WHERE idsmsout = idlockedsmsout;

RETURN Retorno;
END;$$;


--
-- TOC entry 2457 (class 0 OID 0)
-- Dependencies: 270
-- Name: FUNCTION fun_smsout_to_send(inidport integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_smsout_to_send(inidport integer) IS 'Selecciona un sms de smsout para enviarlo.
-- process: 0 nada, 1 blockeado, 2 enviado, 3 falla, 4 destino no permitido, 5 autoprovider, 6 enviado incompleto, 7 expirado tiempo de vida, 8 falla todos los intentos por enviar por todos los puertos, 9 fallan todos los intentos de envio, 10 Espera por reintento de envio, 11 Phone no valido';


--
-- TOC entry 260 (class 1255 OID 17664)
-- Dependencies: 811 5
-- Name: fun_smsout_update_expired(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_smsout_update_expired() RETURNS boolean
    LANGUAGE plpgsql
    AS $$BEGIN
-- Ponemos como expirados todos los sms que hayan sobrepasado el tiempo de vida
UPDATE smsout SET process = 7, dateprocess = now() WHERE process != 7 AND process IN(0, 1, 5, 10) AND (SELECT EXTRACT (MINUTE FROM (now() - dateprocess))) > maxtimelive;
RETURN TRUE;
END;$$;


--
-- TOC entry 2458 (class 0 OID 0)
-- Dependencies: 260
-- Name: FUNCTION fun_smsout_update_expired(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_smsout_update_expired() IS 'Pone como expirados los mensajes que han sobrepasado su tiempo de vida';


--
-- TOC entry 245 (class 1255 OID 16799)
-- Dependencies: 5 811
-- Name: fun_smsout_updatestatus(integer, integer, integer, integer, integer, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_smsout_updatestatus(inidsmsout integer, inprocess integer, inidport integer, inslices integer, inslicessent integer, innote text) RETURNS integer
    LANGUAGE plpgsql
    AS $$DECLARE
Retorno integer DEFAULT -1;
--inidprovidernext integer DEFAULT 0;
inidprovider integer DEFAULT 0;
InternalAttempts INTEGER DEFAULT 0;
InternalIdPort INTEGER DEFAULT 0;

BEGIN

InternalIdPort := inidport;
-- Obtenemos el idprovider para el idport actual
inidprovider := fun_correntportproviders_get_idprovider(InternalIdPort);

IF EXISTS(SELECT idprovider FROM smsout WHERE idsmsout = inidsmsout AND idprovider = 0) THEN
-- SECCION SMS es con auto proveedor

IF inprocess = 3 THEN
-- El envio ha fallado 
-- Buscamos el siguiente proveedor habilitado desde la tabla currentportsproviders
SELECT idport INTO  InternalIdPort FROM currentportsproviders WHERE idport > (SELECT idport FROM smsout WHERE idsmsout = inidsmsout) ORDER BY idport;

IF InternalIdPort IS NULL OR InternalIdPort < 1 THEN
-- No hay mas puertos para intentar
InternalIdPort := inidport;
inprocess := 8;
inidprovider := 0;
InternalAttempts :=1;
ELSE
-- Se intentara con el siguiente puerto encontrado
inprocess := 5;
inidprovider := 0;
END IF;

END IF;

-- Actualizamos este sms que autoproveedor
-- UPDATE smsout SET slices = inslices, slicessent = inslicessent, dateprocess = now(), attempts = InternalAttempts, process = inprocess, idprovidersent = inidprovider, idport = inidport WHERE idsmsout = inidsmsout RETURNING idsmsout INTO Retorno;


ELSE
-- SECCION SMS no es con autoproveedor

InternalAttempts :=1;

IF inprocess = 3 THEN

-- Actualiza el mensaje verificando si ya exede el numero de intentos y si 
IF EXISTS(SELECT idprovider FROM smsout WHERE retryonfail > (attempts+1) AND idsmsout = inidsmsout) THEN
-- En espera para volver a intentar el envio
inprocess := 10;
ELSE
-- Se Exede ya el numero de intentos
inprocess := 9;
END IF;

END IF;

END IF;


UPDATE smsout SET slices = inslices, slicessent = inslicessent, dateprocess = now(), attempts = attempts+InternalAttempts, process = inprocess, idprovidersent = inidprovider, idport = inidport WHERE idsmsout = inidsmsout RETURNING idsmsout INTO Retorno;

RETURN Retorno;
END;$$;


--
-- TOC entry 2459 (class 0 OID 0)
-- Dependencies: 245
-- Name: FUNCTION fun_smsout_updatestatus(inidsmsout integer, inprocess integer, inidport integer, inslices integer, inslicessent integer, innote text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_smsout_updatestatus(inidsmsout integer, inprocess integer, inidport integer, inslices integer, inslicessent integer, innote text) IS 'Actualiza el estado de envio del sms.';


--
-- TOC entry 180 (class 1259 OID 16745)
-- Dependencies: 2272 2273 2274 2275 2276 5
-- Name: smsoutoptions; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE smsoutoptions (
    idsmsoutopt bigint NOT NULL,
    enable boolean,
    name text,
    report boolean DEFAULT false NOT NULL,
    retryonfail integer DEFAULT 0 NOT NULL,
    maxslices integer DEFAULT 1,
    maxtimelive integer DEFAULT 5 NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2460 (class 0 OID 0)
-- Dependencies: 180
-- Name: TABLE smsoutoptions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE smsoutoptions IS 'Opciones globales adicionales para envio de mensajes de texto.';


--
-- TOC entry 2461 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN smsoutoptions.enable; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsoutoptions.enable IS 'usms toma el ultimo registro habilitado para su funcionamiento ignorando los anteriores';


--
-- TOC entry 2462 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN smsoutoptions.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsoutoptions.name IS 'Nombre opcional';


--
-- TOC entry 2463 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN smsoutoptions.report; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsoutoptions.report IS 'Solicita reporte de recibido para cada sms';


--
-- TOC entry 2464 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN smsoutoptions.retryonfail; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsoutoptions.retryonfail IS '0 = No intenta reenviar el sms en caso de falla.
> 0 Numero de reintentos en caso de falla.';


--
-- TOC entry 2465 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN smsoutoptions.maxslices; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsoutoptions.maxslices IS 'Numero maximo de sms que se enviara cuando el texto del mensaje es largo.
De fabrica envia un solo mensaje de 160 caracteres.
Si 0 o 1 de fabrica.';


--
-- TOC entry 259 (class 1255 OID 17663)
-- Dependencies: 5 704 811
-- Name: fun_smsoutoptions_current(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_smsoutoptions_current() RETURNS smsoutoptions
    LANGUAGE plpgsql
    AS $$DECLARE
Retorno smsoutoptions%ROWTYPE;

BEGIN

-- Si no existe un registro habilitado, creamos uno con valores de fabrica
IF NOT EXISTS(SELECT idsmsoutopt FROM smsoutoptions WHERE enable=true) THEN
INSERT INTO smsoutoptions (name, enable) VALUES ('Automatic', true);
END IF;

-- Selecionamos el ultimo registro habilitado desde smsoutoptions
SELECT * INTO Retorno FROM smsoutoptions WHERE enable = true ORDER BY idsmsoutopt DESC LIMIT 1;

IF Retorno.retryonfail =0 OR Retorno.retryonfail IS NULL THEN
Retorno.retryonfail := 1;
UPDATE smsoutoptions SET retryonfail = Retorno.retryonfail WHERE idsmsoutopt = Retorno.idsmsoutopt;
END IF;

IF Retorno.report IS NULL THEN
Retorno.report := false;
UPDATE smsoutoptions SET report = Retorno.report WHERE idsmsoutopt = Retorno.idsmsoutopt;
END IF;

IF Retorno.maxslices=0 OR Retorno.maxslices IS NULL THEN
Retorno.maxslices := 1;
UPDATE smsoutoptions SET maxslices = Retorno.maxslices WHERE idsmsoutopt = Retorno.idsmsoutopt;
END IF;

IF Retorno.maxtimelive<5 OR Retorno.maxtimelive IS NULL THEN
Retorno.maxtimelive := 5; -- Maximo 5 minutos de vida despues de l ultima modificacion del proceso
UPDATE smsoutoptions SET maxtimelive = Retorno.maxtimelive WHERE idsmsoutopt = Retorno.idsmsoutopt;
END IF;


RETURN Retorno;

END;$$;


--
-- TOC entry 2466 (class 0 OID 0)
-- Dependencies: 259
-- Name: FUNCTION fun_smsoutoptions_current(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_smsoutoptions_current() IS 'Obtiene los valores de smsoutoptions actualmente usadas.';


--
-- TOC entry 323 (class 1255 OID 27273)
-- Dependencies: 5 811
-- Name: fun_view_address_byid_xml(integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_view_address_byid_xml(inidaddress integer, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN

IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idaddress, idlocation, geox, geoy, encode(main_street::bytea, 'base64') AS main_street, encode(secundary_street::bytea, 'base64') AS secundary_street, encode(other::bytea, 'base64') AS other, encode(note::bytea, 'base64') AS note, ts FROM address WHERE idaddress = inidaddress;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT * FROM address WHERE idaddress = inidaddress;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';
END;$$;


--
-- TOC entry 293 (class 1255 OID 26959)
-- Dependencies: 811 5
-- Name: fun_view_contacts_byidcontact_xml(integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_view_contacts_byidcontact_xml(inidcontact integer, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN

IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idcontact, enable, encode(title::bytea, 'base64') AS title, encode(firstname::bytea, 'base64') AS firstname, encode(lastname::bytea, 'base64') AS lastname, gender, birthday, typeofid, encode(identification::bytea, 'base64') AS identification, encode(web::bytea, 'base64') as web, encode(email1::bytea, 'base64') as email1, encode(email2::bytea, 'base64') as email2, encode(note::bytea, 'base64') AS note, idaddress, ts   FROM contacts WHERE idcontact = inidcontact;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT * FROM contacts  WHERE idcontact = inidcontact;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';

END;$$;


--
-- TOC entry 2467 (class 0 OID 0)
-- Dependencies: 293
-- Name: FUNCTION fun_view_contacts_byidcontact_xml(inidcontact integer, fieldtextasbase64 boolean); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_view_contacts_byidcontact_xml(inidcontact integer, fieldtextasbase64 boolean) IS 'Devuelve un contacto segun el parametro idcontact en formato xml.';


--
-- TOC entry 288 (class 1255 OID 26958)
-- Dependencies: 5 811
-- Name: fun_view_contacts_to_list_xml(boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_view_contacts_to_list_xml(fieldtextasbase64 boolean DEFAULT true) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN

IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idcontact, enable, encode((lastname ||' '||firstname)::bytea, 'base64') AS name FROM contacts;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT idcontact, enable, (lastname ||' '||firstname) AS name FROM contacts;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';

END;$$;


--
-- TOC entry 2468 (class 0 OID 0)
-- Dependencies: 288
-- Name: FUNCTION fun_view_contacts_to_list_xml(fieldtextasbase64 boolean); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_view_contacts_to_list_xml(fieldtextasbase64 boolean) IS 'Lista de contactos con datos basicos, para ser usado en un combobox o lista simplificada.';


--
-- TOC entry 295 (class 1255 OID 26983)
-- Dependencies: 811 5
-- Name: fun_view_incomingcalls_xml(timestamp without time zone, timestamp without time zone, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_view_incomingcalls_xml(datestart timestamp without time zone, dateend timestamp without time zone, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN

IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idincall, datecall, idport, idphone, callaction, encode(phone::bytea, 'base64') AS phone, flag1, flag2, flag3, flag4, flag5, idmodem, encode(note::bytea, 'base64') AS note, ts FROM incomingcalls WHERE datecall BETWEEN datestart AND dateend ORDER BY datecall DESC;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT * FROM incomingcalls WHERE datecall BETWEEN datestart AND dateend ORDER BY datecall DESC;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';

END;$$;


--
-- TOC entry 2469 (class 0 OID 0)
-- Dependencies: 295
-- Name: FUNCTION fun_view_incomingcalls_xml(datestart timestamp without time zone, dateend timestamp without time zone, fieldtextasbase64 boolean); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_view_incomingcalls_xml(datestart timestamp without time zone, dateend timestamp without time zone, fieldtextasbase64 boolean) IS 'Obtiene la tabla entre las fechas seleccionadas en formato xml';


--
-- TOC entry 249 (class 1255 OID 26960)
-- Dependencies: 811 5
-- Name: fun_view_phones_byid_xml(integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_view_phones_byid_xml(inidphone integer, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN

IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idphone, idcontact, enable, encode(phone::bytea, 'base64') as phone, typephone, idprovider, encode(note::bytea, 'base64') as note, idaddress, encode(phone_ext::bytea, 'base64') as phone_ext, ubiphone, ts FROM phones WHERE idphone = inidphone;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT * FROM phones WHERE idphone = inidphone;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';

END;$$;


--
-- TOC entry 292 (class 1255 OID 26976)
-- Dependencies: 5 811
-- Name: fun_view_phones_byidcontact_simplified_xml(integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_view_phones_byidcontact_simplified_xml(inidcontact integer, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN

IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idphone, idcontact, enable, encode(phone::bytea, 'base64') as phone, idprovider FROM phones WHERE idcontact = inidcontact;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT idphone, idcontact, enable, phone, idprovider FROM phones WHERE idcontact = inidcontact;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';

END;$$;


--
-- TOC entry 300 (class 1255 OID 27021)
-- Dependencies: 5 811
-- Name: fun_view_provider_table_xml(boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_view_provider_table_xml(fieldtextasbase64 boolean DEFAULT true) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN

IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idprovider, enable, encode(cimi::bytea, 'base64') AS cimi, encode(name::bytea, 'base64') AS name, encode(note::bytea, 'base64') AS note, ts FROM provider;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT * FROM provider;
SELECT * FROM cursor_to_xml(CursorResult, 1000, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';
END;$$;


--
-- TOC entry 2470 (class 0 OID 0)
-- Dependencies: 300
-- Name: FUNCTION fun_view_provider_table_xml(fieldtextasbase64 boolean); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION fun_view_provider_table_xml(fieldtextasbase64 boolean) IS 'Devuelve la tabla en formato xml';


--
-- TOC entry 302 (class 1255 OID 27038)
-- Dependencies: 811 5
-- Name: fun_view_smsin_table_filter_xml(timestamp without time zone, timestamp without time zone, integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_view_smsin_table_filter_xml(datestart timestamp without time zone, dateend timestamp without time zone, maxrows integer, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN

IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idsmsin, dateload, idprovider, idphone, encode(phone::bytea, 'base64') AS phone, datesms, encode(message::bytea, 'base64') AS message, idport, status, flag1, flag2, flag3, flag4, flag5, encode(note::bytea, 'base64') AS note, ts FROM smsin WHERE dateload BETWEEN datestart AND dateend ORDER BY dateload DESC LIMIT maxrows;
SELECT * FROM cursor_to_xml(CursorResult, maxrows+1, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT * FROM smsin WHERE dateload BETWEEN datestart AND dateend ORDER BY dateload DESC LIMIT maxrows;
SELECT * FROM cursor_to_xml(CursorResult, maxrows+1, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';

END;$$;


--
-- TOC entry 283 (class 1255 OID 27026)
-- Dependencies: 811 5
-- Name: fun_view_smsout_table_filter_xml(timestamp without time zone, timestamp without time zone, integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fun_view_smsout_table_filter_xml(datestart timestamp without time zone, dateend timestamp without time zone, maxrows integer, fieldtextasbase64 boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$DECLARE

Retorno TEXT DEFAULT '';
CursorResult refcursor;

BEGIN

IF fieldtextasbase64 THEN

OPEN CursorResult FOR SELECT idsmsout, dateload, idprovider, idsmstype, idphone, encode(phone::bytea, 'base64') AS phone, datetosend, encode(message::bytea, 'base64') AS message, dateprocess, process, priority, attempts, idprovidersent, slices, slicessent, messageclass, report, maxslices, enablemessageclass, idport, flag1, flag2, flag3, flag4, flag5, retryonfail, maxtimelive, encode(note::bytea, 'base64') AS note, ts FROM smsout WHERE datetosend BETWEEN datestart AND dateend ORDER BY datetosend DESC LIMIT maxrows;
SELECT * FROM cursor_to_xml(CursorResult, maxrows+1, false, false, '') INTO Retorno;
CLOSE CursorResult;

ELSE

OPEN CursorResult FOR SELECT * FROM smsout WHERE datetosend BETWEEN datestart AND dateend ORDER BY datetosend DESC LIMIT maxrows;
SELECT * FROM cursor_to_xml(CursorResult, maxrows+1, false, false, '') INTO Retorno;
CLOSE CursorResult;

END IF;

RETURN '<table>'||Retorno||'</table>';

END;$$;


--
-- TOC entry 329 (class 1255 OID 27333)
-- Dependencies: 5 811
-- Name: trigger_idaddress_to_cero(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION trigger_idaddress_to_cero() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE
lastidaddres INTEGER DEFAULT 0;

BEGIN
lastidaddres := OLD.idaddress;

IF NEW.idaddress = 0 AND lastidaddres > 0 THEN
DELETE FROM address WHERE idaddress = lastidaddres;
END IF;

   RETURN NEW;
END;$$;


--
-- TOC entry 2471 (class 0 OID 0)
-- Dependencies: 329
-- Name: FUNCTION trigger_idaddress_to_cero(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION trigger_idaddress_to_cero() IS 'Cuando seteamos el campo idaddress a 0 esto elimina ese registro de la tabla address.
';


--
-- TOC entry 225 (class 1259 OID 27136)
-- Dependencies: 2318 2319 2320 2321 2322 2323 2324 2325 5 1742 1742 1742 1742
-- Name: address; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE address (
    idaddress bigint NOT NULL,
    idlocation text DEFAULT '0'::text NOT NULL,
    geox double precision DEFAULT 0 NOT NULL,
    geoy double precision DEFAULT 0 NOT NULL,
    main_street text COLLATE pg_catalog."C.UTF-8" DEFAULT ''::text NOT NULL,
    secundary_street text COLLATE pg_catalog."C.UTF-8" DEFAULT ''::text NOT NULL,
    other text COLLATE pg_catalog."C.UTF-8" DEFAULT ''::text NOT NULL,
    note text COLLATE pg_catalog."C.UTF-8" DEFAULT ''::text NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2472 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE address; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE address IS 'Tabla de Direcciones, contiene todas las direcciones de las diferentes tablas.';


--
-- TOC entry 2473 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN address.idlocation; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN address.idlocation IS 'Representa el id formado por pais, ciudad, estado, sector, subsector, obtenido de la view_location';


--
-- TOC entry 2474 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN address.main_street; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN address.main_street IS 'Calle principal';


--
-- TOC entry 2475 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN address.secundary_street; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN address.secundary_street IS 'Calle secundaria';


--
-- TOC entry 2476 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN address.other; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN address.other IS 'Otros detalles';


--
-- TOC entry 224 (class 1259 OID 27134)
-- Dependencies: 5 225
-- Name: address_idaddress_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE address_idaddress_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2477 (class 0 OID 0)
-- Dependencies: 224
-- Name: address_idaddress_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE address_idaddress_seq OWNED BY address.idaddress;


--
-- TOC entry 215 (class 1259 OID 26237)
-- Dependencies: 2310 2311 2312 1742 5
-- Name: location_sector; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE location_sector (
    idsector bigint NOT NULL,
    idcity integer DEFAULT 0 NOT NULL,
    name text COLLATE pg_catalog."C.UTF-8" DEFAULT 'sector'::text NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 214 (class 1259 OID 26235)
-- Dependencies: 215 5
-- Name: address_sector_idsector_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE address_sector_idsector_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2478 (class 0 OID 0)
-- Dependencies: 214
-- Name: address_sector_idsector_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE address_sector_idsector_seq OWNED BY location_sector.idsector;


--
-- TOC entry 217 (class 1259 OID 26257)
-- Dependencies: 2314 2315 2316 1744 5
-- Name: location_subsector; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE location_subsector (
    idsubsector bigint NOT NULL,
    idsector integer DEFAULT 0 NOT NULL,
    name text COLLATE pg_catalog."es_EC.utf8" DEFAULT 'subsector'::text NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 26255)
-- Dependencies: 5 217
-- Name: address_subsector_idsubsector_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE address_subsector_idsubsector_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2479 (class 0 OID 0)
-- Dependencies: 216
-- Name: address_subsector_idsubsector_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE address_subsector_idsubsector_seq OWNED BY location_subsector.idsubsector;


--
-- TOC entry 177 (class 1259 OID 16622)
-- Dependencies: 2265 2266 2267 1744 5
-- Name: blacklist; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE blacklist (
    idbl integer NOT NULL,
    idprovider integer DEFAULT 0,
    idphone integer DEFAULT 0,
    note text COLLATE pg_catalog."es_EC.utf8",
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2480 (class 0 OID 0)
-- Dependencies: 177
-- Name: TABLE blacklist; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE blacklist IS 'Lista de numeros a los que no se enviaran sms.';


--
-- TOC entry 176 (class 1259 OID 16620)
-- Dependencies: 5 177
-- Name: blacklist_idbl_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE blacklist_idbl_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2481 (class 0 OID 0)
-- Dependencies: 176
-- Name: blacklist_idbl_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE blacklist_idbl_seq OWNED BY blacklist.idbl;


--
-- TOC entry 211 (class 1259 OID 26177)
-- Dependencies: 2305 2306 2307 2308 1744 5
-- Name: location_city; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE location_city (
    idcity bigint NOT NULL,
    idstate integer DEFAULT 0 NOT NULL,
    name text COLLATE pg_catalog."es_EC.utf8" DEFAULT 'city'::text NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL,
    code text DEFAULT ''::text NOT NULL
);


--
-- TOC entry 210 (class 1259 OID 26175)
-- Dependencies: 211 5
-- Name: city_idcity_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE city_idcity_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2482 (class 0 OID 0)
-- Dependencies: 210
-- Name: city_idcity_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE city_idcity_seq OWNED BY location_city.idcity;


--
-- TOC entry 165 (class 1259 OID 16387)
-- Dependencies: 2183 2184 2185 2186 2187 2188 2189 2190 2191 2192 2193 2194 2195 2196 5
-- Name: contacts; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE contacts (
    idcontact integer NOT NULL,
    enable boolean DEFAULT true,
    firstname text DEFAULT 'nombre'::text NOT NULL,
    lastname text DEFAULT ' '::text NOT NULL,
    gender integer DEFAULT 0 NOT NULL,
    birthday date DEFAULT '1900-01-01'::date NOT NULL,
    typeofid integer DEFAULT 0 NOT NULL,
    identification text DEFAULT ''::text NOT NULL,
    web text DEFAULT ''::text NOT NULL,
    email1 text DEFAULT ''::text NOT NULL,
    email2 text DEFAULT ''::text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL,
    title text DEFAULT 'Sr@'::text NOT NULL,
    idaddress integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 2483 (class 0 OID 0)
-- Dependencies: 165
-- Name: TABLE contacts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE contacts IS 'Datos basicos de contactos';


--
-- TOC entry 164 (class 1259 OID 16385)
-- Dependencies: 165 5
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2484 (class 0 OID 0)
-- Dependencies: 164
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE contacts_id_seq OWNED BY contacts.idcontact;


--
-- TOC entry 207 (class 1259 OID 26134)
-- Dependencies: 2296 2297 2298 5
-- Name: location_country; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE location_country (
    idcountry bigint NOT NULL,
    name text DEFAULT 'country'::text NOT NULL,
    code text DEFAULT '000'::text NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2485 (class 0 OID 0)
-- Dependencies: 207
-- Name: TABLE location_country; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE location_country IS 'Paices del mundo';


--
-- TOC entry 206 (class 1259 OID 26132)
-- Dependencies: 207 5
-- Name: country_idcountry_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE country_idcountry_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2486 (class 0 OID 0)
-- Dependencies: 206
-- Name: country_idcountry_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE country_idcountry_seq OWNED BY location_country.idcountry;


--
-- TOC entry 178 (class 1259 OID 16696)
-- Dependencies: 2268 2269 2270 5
-- Name: currentportsproviders; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE currentportsproviders (
    idport integer DEFAULT 0 NOT NULL,
    port text,
    cimi text,
    imei text,
    idprovider integer,
    lastupdate timestamp without time zone DEFAULT now(),
    idmodem integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 2487 (class 0 OID 0)
-- Dependencies: 178
-- Name: TABLE currentportsproviders; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE currentportsproviders IS 'Tabla de relacion entre puertos y proveedor que estan usando actualmente';


--
-- TOC entry 2488 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN currentportsproviders.idport; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN currentportsproviders.idport IS 'IdPort, dato proveniente de la tabla serialport de usmsd.sqlite';


--
-- TOC entry 2489 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN currentportsproviders.port; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN currentportsproviders.port IS 'Dato proveniente de la tabla serialport de usmsd.sqlite';


--
-- TOC entry 2490 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN currentportsproviders.cimi; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN currentportsproviders.cimi IS 'Dato proveniente del modem';


--
-- TOC entry 2491 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN currentportsproviders.imei; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN currentportsproviders.imei IS 'Dato proveniente del modem';


--
-- TOC entry 2492 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN currentportsproviders.idprovider; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN currentportsproviders.idprovider IS 'Dato proveniente de la tabla provider usndo como referencia el campo cimi para obtenerlo.';


--
-- TOC entry 2493 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN currentportsproviders.lastupdate; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN currentportsproviders.lastupdate IS 'Fecha de la ultima actualizacion. Si este campo exede de 2 minuto en relacion a la fecha actual deberia eliminarse.';


--
-- TOC entry 182 (class 1259 OID 16833)
-- Dependencies: 2278 2279 2280 2281 2282 2283 2284 2285 2286 2287 2288 5
-- Name: incomingcalls; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE incomingcalls (
    idincall bigint NOT NULL,
    datecall timestamp without time zone DEFAULT now() NOT NULL,
    idport integer DEFAULT 0 NOT NULL,
    idphone integer DEFAULT 0 NOT NULL,
    callaction integer DEFAULT 0 NOT NULL,
    phone text NOT NULL,
    note text,
    flag1 integer DEFAULT 0 NOT NULL,
    flag2 integer DEFAULT 0 NOT NULL,
    flag3 integer DEFAULT 0 NOT NULL,
    flag4 integer DEFAULT 0 NOT NULL,
    flag5 integer DEFAULT 0 NOT NULL,
    idmodem integer DEFAULT 0 NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2494 (class 0 OID 0)
-- Dependencies: 182
-- Name: TABLE incomingcalls; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE incomingcalls IS 'Registro de llamadas entrantes';


--
-- TOC entry 2495 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN incomingcalls.datecall; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN incomingcalls.datecall IS 'Fecha de recepcion de la llamada.';


--
-- TOC entry 2496 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN incomingcalls.idport; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN incomingcalls.idport IS 'Idport por el cual se recibio la llamada.';


--
-- TOC entry 2497 (class 0 OID 0)
-- Dependencies: 182
-- Name: COLUMN incomingcalls.callaction; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN incomingcalls.callaction IS 'Accion tomada ante esa llamada: ignorada, rechazada, contestada';


--
-- TOC entry 181 (class 1259 OID 16831)
-- Dependencies: 182 5
-- Name: incomingcalls_idincall_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE incomingcalls_idincall_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2498 (class 0 OID 0)
-- Dependencies: 181
-- Name: incomingcalls_idincall_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE incomingcalls_idincall_seq OWNED BY incomingcalls.idincall;


--
-- TOC entry 209 (class 1259 OID 26156)
-- Dependencies: 2300 2301 2302 2303 5
-- Name: location_states; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE location_states (
    idstate bigint NOT NULL,
    idcountry integer DEFAULT 0 NOT NULL,
    name text DEFAULT 'state'::text NOT NULL,
    code text DEFAULT '000'::text NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2499 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE location_states; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE location_states IS 'Estados o provincias';


--
-- TOC entry 200 (class 1259 OID 17582)
-- Dependencies: 2290 2291 2292 2293 2294 1744 1744 1744 5
-- Name: modem; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE modem (
    idmodem bigint NOT NULL,
    imei text DEFAULT '01234'::text NOT NULL,
    manufacturer text COLLATE pg_catalog."es_EC.utf8" DEFAULT 'Could not be obtained'::text NOT NULL,
    model text COLLATE pg_catalog."es_EC.utf8" DEFAULT 'Could not be obtained'::text NOT NULL,
    revision text COLLATE pg_catalog."es_EC.utf8" DEFAULT 'Could not be obtained'::text NOT NULL,
    note text,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2500 (class 0 OID 0)
-- Dependencies: 200
-- Name: TABLE modem; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE modem IS 'Modems que han sido automaticamente registrados por el sistema';


--
-- TOC entry 199 (class 1259 OID 17580)
-- Dependencies: 200 5
-- Name: modem_idmodem_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE modem_idmodem_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2501 (class 0 OID 0)
-- Dependencies: 199
-- Name: modem_idmodem_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE modem_idmodem_seq OWNED BY modem.idmodem;


--
-- TOC entry 167 (class 1259 OID 16423)
-- Dependencies: 2198 2199 2200 2201 2202 2203 2204 2205 2206 2207 2208 5
-- Name: phones; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phones (
    idphone integer NOT NULL,
    idcontact integer DEFAULT 0 NOT NULL,
    enable boolean DEFAULT true NOT NULL,
    phone text DEFAULT ''::text NOT NULL,
    typephone integer DEFAULT 0 NOT NULL,
    idprovider integer DEFAULT 0 NOT NULL,
    note text DEFAULT ' '::text NOT NULL,
    idaddresshhhhhhh text DEFAULT 'XXXXX'::text NOT NULL,
    phone_ext text DEFAULT ' '::text NOT NULL,
    ubiphone integer DEFAULT 0 NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL,
    idaddress integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 2502 (class 0 OID 0)
-- Dependencies: 167
-- Name: TABLE phones; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE phones IS 'Numeros telefonicos de contactos.';


--
-- TOC entry 2503 (class 0 OID 0)
-- Dependencies: 167
-- Name: COLUMN phones.typephone; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN phones.typephone IS '0: No especificado
1: Fijo
2: Movil';


--
-- TOC entry 166 (class 1259 OID 16421)
-- Dependencies: 167 5
-- Name: phones_idphone_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE phones_idphone_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2504 (class 0 OID 0)
-- Dependencies: 166
-- Name: phones_idphone_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE phones_idphone_seq OWNED BY phones.idphone;


--
-- TOC entry 169 (class 1259 OID 16452)
-- Dependencies: 2210 2211 2212 2213 2214 5
-- Name: provider; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE provider (
    idprovider integer NOT NULL,
    enable boolean DEFAULT true NOT NULL,
    cimi text DEFAULT ''::text NOT NULL,
    name text DEFAULT ''::text NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2505 (class 0 OID 0)
-- Dependencies: 169
-- Name: TABLE provider; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE provider IS 'Proveedores de telefonia';


--
-- TOC entry 2506 (class 0 OID 0)
-- Dependencies: 169
-- Name: COLUMN provider.cimi; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN provider.cimi IS 'Obtiene desde el modem con el comando AT+CIMI, numero de identificacion inico de cada proveedor';


--
-- TOC entry 2507 (class 0 OID 0)
-- Dependencies: 169
-- Name: COLUMN provider.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN provider.name IS 'Nombre del proveedor';


--
-- TOC entry 168 (class 1259 OID 16450)
-- Dependencies: 169 5
-- Name: provider_idprovider_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE provider_idprovider_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2508 (class 0 OID 0)
-- Dependencies: 168
-- Name: provider_idprovider_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE provider_idprovider_seq OWNED BY provider.idprovider;


--
-- TOC entry 171 (class 1259 OID 16522)
-- Dependencies: 2216 2217 2218 2219 2220 2221 2222 2223 2224 2225 2226 2227 2228 2229 2230 5 1744 1744
-- Name: smsin; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE smsin (
    idsmsin bigint NOT NULL,
    dateload timestamp without time zone DEFAULT now() NOT NULL,
    idprovider integer DEFAULT 0 NOT NULL,
    idphone integer DEFAULT 0 NOT NULL,
    phone text DEFAULT ''::text NOT NULL,
    datesms timestamp without time zone DEFAULT '1990-01-01 00:00:00'::timestamp without time zone NOT NULL,
    message text COLLATE pg_catalog."es_EC.utf8" DEFAULT ''::text NOT NULL,
    note text COLLATE pg_catalog."es_EC.utf8" DEFAULT ''::text NOT NULL,
    idport integer DEFAULT 0,
    status integer DEFAULT 0 NOT NULL,
    flag1 integer DEFAULT 0 NOT NULL,
    flag2 integer DEFAULT 0 NOT NULL,
    flag3 integer DEFAULT 0 NOT NULL,
    flag4 integer DEFAULT 0 NOT NULL,
    flag5 integer DEFAULT 0 NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2509 (class 0 OID 0)
-- Dependencies: 171
-- Name: TABLE smsin; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE smsin IS 'Tabla de sms entrantes';


--
-- TOC entry 229 (class 1259 OID 27197)
-- Dependencies: 2339 2340 2341 2342 2343 2344 2345 2346 2347 2348 2349 5
-- Name: smsin_consumer; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE smsin_consumer (
    idsmsinf bigint NOT NULL,
    idsmsin integer DEFAULT 0 NOT NULL,
    f1 integer DEFAULT 0 NOT NULL,
    dateprocessf1 timestamp without time zone DEFAULT now() NOT NULL,
    f2 integer DEFAULT 0 NOT NULL,
    dateprocessf2 timestamp without time zone DEFAULT now() NOT NULL,
    f3 integer DEFAULT 0 NOT NULL,
    dateprocessf3 timestamp without time zone DEFAULT now() NOT NULL,
    f4 integer DEFAULT 0 NOT NULL,
    dateprocessf4 timestamp without time zone DEFAULT now() NOT NULL,
    f5 integer DEFAULT 0 NOT NULL,
    dateprocessf5 timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2510 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE smsin_consumer; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE smsin_consumer IS 'Tabla con los flags (aplicaciones que consumen el sms)';


--
-- TOC entry 2511 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN smsin_consumer.dateprocessf1; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsin_consumer.dateprocessf1 IS 'Date Process f1';


--
-- TOC entry 228 (class 1259 OID 27195)
-- Dependencies: 5 229
-- Name: smsin_consumer_idsmsinf_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE smsin_consumer_idsmsinf_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2512 (class 0 OID 0)
-- Dependencies: 228
-- Name: smsin_consumer_idsmsinf_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE smsin_consumer_idsmsinf_seq OWNED BY smsin_consumer.idsmsinf;


--
-- TOC entry 170 (class 1259 OID 16520)
-- Dependencies: 171 5
-- Name: smsin_idsmsin_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE smsin_idsmsin_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2513 (class 0 OID 0)
-- Dependencies: 170
-- Name: smsin_idsmsin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE smsin_idsmsin_seq OWNED BY smsin.idsmsin;


--
-- TOC entry 227 (class 1259 OID 27173)
-- Dependencies: 2327 2328 2329 2330 2331 2332 2333 2334 2335 2336 2337 5
-- Name: smsout_consumer; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE smsout_consumer (
    idsmsoutf bigint NOT NULL,
    idsmsout integer DEFAULT 0 NOT NULL,
    f1 integer DEFAULT 0 NOT NULL,
    dateprocessf1 timestamp without time zone DEFAULT now() NOT NULL,
    f2 integer DEFAULT 0 NOT NULL,
    dateprocessf2 timestamp without time zone DEFAULT now() NOT NULL,
    f3 integer DEFAULT 0 NOT NULL,
    dateprocessf3 timestamp without time zone DEFAULT now() NOT NULL,
    f4 integer DEFAULT 0 NOT NULL,
    dateprocessf4 timestamp without time zone DEFAULT now() NOT NULL,
    f5 integer DEFAULT 0 NOT NULL,
    dateprocessf5 timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2514 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE smsout_consumer; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE smsout_consumer IS 'Tabla con los flags (aplicaciones que consumen el sms)';


--
-- TOC entry 2515 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN smsout_consumer.dateprocessf1; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN smsout_consumer.dateprocessf1 IS 'Date Process f1';


--
-- TOC entry 226 (class 1259 OID 27171)
-- Dependencies: 5 227
-- Name: smsout_consumer_idsmsoutf_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE smsout_consumer_idsmsoutf_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2516 (class 0 OID 0)
-- Dependencies: 226
-- Name: smsout_consumer_idsmsoutf_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE smsout_consumer_idsmsoutf_seq OWNED BY smsout_consumer.idsmsoutf;


--
-- TOC entry 172 (class 1259 OID 16577)
-- Dependencies: 173 5
-- Name: smsout_idsmsout_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE smsout_idsmsout_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2517 (class 0 OID 0)
-- Dependencies: 172
-- Name: smsout_idsmsout_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE smsout_idsmsout_seq OWNED BY smsout.idsmsout;


--
-- TOC entry 179 (class 1259 OID 16743)
-- Dependencies: 5 180
-- Name: smsoutoptions_idsmsoutopt_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE smsoutoptions_idsmsoutopt_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2518 (class 0 OID 0)
-- Dependencies: 179
-- Name: smsoutoptions_idsmsoutopt_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE smsoutoptions_idsmsoutopt_seq OWNED BY smsoutoptions.idsmsoutopt;


--
-- TOC entry 208 (class 1259 OID 26154)
-- Dependencies: 209 5
-- Name: states_idstate_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE states_idstate_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2519 (class 0 OID 0)
-- Dependencies: 208
-- Name: states_idstate_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE states_idstate_seq OWNED BY location_states.idstate;


--
-- TOC entry 230 (class 1259 OID 27240)
-- Dependencies: 2179 5
-- Name: view_callin; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW view_callin AS
    SELECT incomingcalls.idincall, incomingcalls.datecall, incomingcalls.idport, incomingcalls.callaction, incomingcalls.idphone, incomingcalls.phone, incomingcalls.flag1, phones.idcontact, phones.enable, phones.phone AS phone_phone, phones.typephone AS type, phones.idprovider FROM incomingcalls, phones WHERE (incomingcalls.idphone = phones.idphone);


--
-- TOC entry 231 (class 1259 OID 27244)
-- Dependencies: 2180 5
-- Name: view_contacts_phones; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW view_contacts_phones AS
    SELECT contacts.idcontact, contacts.enable AS contact_enable, contacts.title, contacts.firstname, contacts.lastname, contacts.gender, contacts.birthday, contacts.typeofid, contacts.identification, contacts.web, contacts.email1, contacts.email2, phones.idphone, phones.enable AS phone_enable, phones.typephone AS type, phones.idprovider, phones.ubiphone, phones.phone, phones.phone_ext, phones.idaddresshhhhhhh AS idaddress, phones.note FROM (contacts LEFT JOIN phones ON ((contacts.idcontact = phones.idcontact)));


--
-- TOC entry 223 (class 1259 OID 27102)
-- Dependencies: 2178 1742 5 1744 1744
-- Name: view_locations; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW view_locations AS
    SELECT countryx.idcountry, countryx.name AS country, countryx.code AS country_code, statesx.idstate, statesx.name AS state, statesx.code AS state_code, cityx.idcity, cityx.name AS city, sectorx.idsector, sectorx.name AS sector, subsectorx.idsubsector, subsectorx.name AS subsector, ((((('1'::text || (COALESCE(countryx.idcountry, (0)::bigint))::text) || (COALESCE(statesx.idstate, (0)::bigint))::text) || (COALESCE(cityx.idcity, (0)::bigint))::text) || (COALESCE(sectorx.idsector, (0)::bigint))::text) || COALESCE(subsectorx.idsubsector, (0)::bigint)) AS idlocation FROM ((((location_country countryx LEFT JOIN location_states statesx ON ((countryx.idcountry = statesx.idcountry))) LEFT JOIN location_city cityx ON ((statesx.idstate = cityx.idstate))) LEFT JOIN location_sector sectorx ON ((cityx.idcity = sectorx.idcity))) LEFT JOIN location_subsector subsectorx ON ((sectorx.idsector = subsectorx.idsector)));


--
-- TOC entry 175 (class 1259 OID 16599)
-- Dependencies: 2261 2262 2263 1744 5
-- Name: whitelist; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE whitelist (
    idwl integer NOT NULL,
    idprovider integer DEFAULT 0,
    idphone integer DEFAULT 0,
    note text COLLATE pg_catalog."es_EC.utf8",
    ts timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 2520 (class 0 OID 0)
-- Dependencies: 175
-- Name: TABLE whitelist; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE whitelist IS 'Lista de numeros para envio de sms sin restriccion';


--
-- TOC entry 174 (class 1259 OID 16597)
-- Dependencies: 175 5
-- Name: whitelist_idwl_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE whitelist_idwl_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2521 (class 0 OID 0)
-- Dependencies: 174
-- Name: whitelist_idwl_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE whitelist_idwl_seq OWNED BY whitelist.idwl;


--
-- TOC entry 2317 (class 2604 OID 27139)
-- Dependencies: 225 224 225
-- Name: idaddress; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY address ALTER COLUMN idaddress SET DEFAULT nextval('address_idaddress_seq'::regclass);


--
-- TOC entry 2264 (class 2604 OID 16625)
-- Dependencies: 176 177 177
-- Name: idbl; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY blacklist ALTER COLUMN idbl SET DEFAULT nextval('blacklist_idbl_seq'::regclass);


--
-- TOC entry 2182 (class 2604 OID 16390)
-- Dependencies: 165 164 165
-- Name: idcontact; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY contacts ALTER COLUMN idcontact SET DEFAULT nextval('contacts_id_seq'::regclass);


--
-- TOC entry 2277 (class 2604 OID 16836)
-- Dependencies: 181 182 182
-- Name: idincall; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY incomingcalls ALTER COLUMN idincall SET DEFAULT nextval('incomingcalls_idincall_seq'::regclass);


--
-- TOC entry 2304 (class 2604 OID 26180)
-- Dependencies: 211 210 211
-- Name: idcity; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY location_city ALTER COLUMN idcity SET DEFAULT nextval('city_idcity_seq'::regclass);


--
-- TOC entry 2295 (class 2604 OID 26137)
-- Dependencies: 207 206 207
-- Name: idcountry; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY location_country ALTER COLUMN idcountry SET DEFAULT nextval('country_idcountry_seq'::regclass);


--
-- TOC entry 2309 (class 2604 OID 26240)
-- Dependencies: 215 214 215
-- Name: idsector; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY location_sector ALTER COLUMN idsector SET DEFAULT nextval('address_sector_idsector_seq'::regclass);


--
-- TOC entry 2299 (class 2604 OID 26159)
-- Dependencies: 208 209 209
-- Name: idstate; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY location_states ALTER COLUMN idstate SET DEFAULT nextval('states_idstate_seq'::regclass);


--
-- TOC entry 2313 (class 2604 OID 26260)
-- Dependencies: 217 216 217
-- Name: idsubsector; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY location_subsector ALTER COLUMN idsubsector SET DEFAULT nextval('address_subsector_idsubsector_seq'::regclass);


--
-- TOC entry 2289 (class 2604 OID 17585)
-- Dependencies: 200 199 200
-- Name: idmodem; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY modem ALTER COLUMN idmodem SET DEFAULT nextval('modem_idmodem_seq'::regclass);


--
-- TOC entry 2197 (class 2604 OID 16426)
-- Dependencies: 167 166 167
-- Name: idphone; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY phones ALTER COLUMN idphone SET DEFAULT nextval('phones_idphone_seq'::regclass);


--
-- TOC entry 2209 (class 2604 OID 16455)
-- Dependencies: 169 168 169
-- Name: idprovider; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY provider ALTER COLUMN idprovider SET DEFAULT nextval('provider_idprovider_seq'::regclass);


--
-- TOC entry 2215 (class 2604 OID 16525)
-- Dependencies: 170 171 171
-- Name: idsmsin; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY smsin ALTER COLUMN idsmsin SET DEFAULT nextval('smsin_idsmsin_seq'::regclass);


--
-- TOC entry 2338 (class 2604 OID 27200)
-- Dependencies: 229 228 229
-- Name: idsmsinf; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY smsin_consumer ALTER COLUMN idsmsinf SET DEFAULT nextval('smsin_consumer_idsmsinf_seq'::regclass);


--
-- TOC entry 2231 (class 2604 OID 16582)
-- Dependencies: 173 172 173
-- Name: idsmsout; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY smsout ALTER COLUMN idsmsout SET DEFAULT nextval('smsout_idsmsout_seq'::regclass);


--
-- TOC entry 2326 (class 2604 OID 27176)
-- Dependencies: 227 226 227
-- Name: idsmsoutf; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY smsout_consumer ALTER COLUMN idsmsoutf SET DEFAULT nextval('smsout_consumer_idsmsoutf_seq'::regclass);


--
-- TOC entry 2271 (class 2604 OID 16748)
-- Dependencies: 179 180 180
-- Name: idsmsoutopt; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY smsoutoptions ALTER COLUMN idsmsoutopt SET DEFAULT nextval('smsoutoptions_idsmsoutopt_seq'::regclass);


--
-- TOC entry 2260 (class 2604 OID 16602)
-- Dependencies: 175 174 175
-- Name: idwl; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY whitelist ALTER COLUMN idwl SET DEFAULT nextval('whitelist_idwl_seq'::regclass);


--
-- TOC entry 2353 (class 2606 OID 16428)
-- Dependencies: 167 167 2430
-- Name: id; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT id PRIMARY KEY (idphone);


--
-- TOC entry 2351 (class 2606 OID 16400)
-- Dependencies: 165 165 2430
-- Name: idcontact; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT idcontact PRIMARY KEY (idcontact);


--
-- TOC entry 2383 (class 2606 OID 26187)
-- Dependencies: 211 211 2430
-- Name: pk_city; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_city
    ADD CONSTRAINT pk_city PRIMARY KEY (idcity);


--
-- TOC entry 2395 (class 2606 OID 27152)
-- Dependencies: 225 225 2430
-- Name: pk_idaddress; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY address
    ADD CONSTRAINT pk_idaddress PRIMARY KEY (idaddress);


--
-- TOC entry 2363 (class 2606 OID 16632)
-- Dependencies: 177 177 2430
-- Name: pk_idbl; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY blacklist
    ADD CONSTRAINT pk_idbl PRIMARY KEY (idbl);


--
-- TOC entry 2375 (class 2606 OID 26142)
-- Dependencies: 207 207 2430
-- Name: pk_idcountry; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_country
    ADD CONSTRAINT pk_idcountry PRIMARY KEY (idcountry);


--
-- TOC entry 2365 (class 2606 OID 16704)
-- Dependencies: 178 178 2430
-- Name: pk_idcpp; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY currentportsproviders
    ADD CONSTRAINT pk_idcpp PRIMARY KEY (idport);


--
-- TOC entry 2369 (class 2606 OID 16845)
-- Dependencies: 182 182 2430
-- Name: pk_idincall; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY incomingcalls
    ADD CONSTRAINT pk_idincall PRIMARY KEY (idincall);


--
-- TOC entry 2371 (class 2606 OID 17587)
-- Dependencies: 200 200 2430
-- Name: pk_idmodem; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY modem
    ADD CONSTRAINT pk_idmodem PRIMARY KEY (idmodem);


--
-- TOC entry 2355 (class 2606 OID 16464)
-- Dependencies: 169 169 2430
-- Name: pk_idprovider; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY provider
    ADD CONSTRAINT pk_idprovider PRIMARY KEY (idprovider);


--
-- TOC entry 2387 (class 2606 OID 26247)
-- Dependencies: 215 215 2430
-- Name: pk_idsector; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_sector
    ADD CONSTRAINT pk_idsector PRIMARY KEY (idsector);


--
-- TOC entry 2357 (class 2606 OID 16528)
-- Dependencies: 171 171 2430
-- Name: pk_idsmsin; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY smsin
    ADD CONSTRAINT pk_idsmsin PRIMARY KEY (idsmsin);


--
-- TOC entry 2399 (class 2606 OID 27213)
-- Dependencies: 229 229 2430
-- Name: pk_idsmsinf; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY smsin_consumer
    ADD CONSTRAINT pk_idsmsinf PRIMARY KEY (idsmsinf);


--
-- TOC entry 2397 (class 2606 OID 27189)
-- Dependencies: 227 227 2430
-- Name: pk_idsmsoutf; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY smsout_consumer
    ADD CONSTRAINT pk_idsmsoutf PRIMARY KEY (idsmsoutf);


--
-- TOC entry 2367 (class 2606 OID 16756)
-- Dependencies: 180 180 2430
-- Name: pk_idsmsoutopt; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY smsoutoptions
    ADD CONSTRAINT pk_idsmsoutopt PRIMARY KEY (idsmsoutopt);


--
-- TOC entry 2379 (class 2606 OID 26167)
-- Dependencies: 209 209 2430
-- Name: pk_idstate; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_states
    ADD CONSTRAINT pk_idstate PRIMARY KEY (idstate);


--
-- TOC entry 2391 (class 2606 OID 26267)
-- Dependencies: 217 217 2430
-- Name: pk_idsubsector; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_subsector
    ADD CONSTRAINT pk_idsubsector PRIMARY KEY (idsubsector);


--
-- TOC entry 2361 (class 2606 OID 16609)
-- Dependencies: 175 175 2430
-- Name: pk_idwl; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY whitelist
    ADD CONSTRAINT pk_idwl PRIMARY KEY (idwl);


--
-- TOC entry 2359 (class 2606 OID 16596)
-- Dependencies: 173 173 2430
-- Name: pk_smsout; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY smsout
    ADD CONSTRAINT pk_smsout PRIMARY KEY (idsmsout);


--
-- TOC entry 2389 (class 2606 OID 26249)
-- Dependencies: 215 215 215 2430
-- Name: uni_idcity_name_sector; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_sector
    ADD CONSTRAINT uni_idcity_name_sector UNIQUE (idcity, name);


--
-- TOC entry 2393 (class 2606 OID 26269)
-- Dependencies: 217 217 217 2430
-- Name: uni_idsector_name_subsector; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_subsector
    ADD CONSTRAINT uni_idsector_name_subsector UNIQUE (idsector, name);


--
-- TOC entry 2385 (class 2606 OID 26229)
-- Dependencies: 211 211 211 2430
-- Name: uni_idstate_name_city; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_city
    ADD CONSTRAINT uni_idstate_name_city UNIQUE (idstate, name);


--
-- TOC entry 2381 (class 2606 OID 26222)
-- Dependencies: 209 209 209 2430
-- Name: uni_idstate_name_states; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_states
    ADD CONSTRAINT uni_idstate_name_states UNIQUE (idcountry, name);


--
-- TOC entry 2373 (class 2606 OID 17624)
-- Dependencies: 200 200 2430
-- Name: uni_imei_modem; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY modem
    ADD CONSTRAINT uni_imei_modem UNIQUE (imei);


--
-- TOC entry 2377 (class 2606 OID 26153)
-- Dependencies: 207 207 2430
-- Name: uni_namecountry; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY location_country
    ADD CONSTRAINT uni_namecountry UNIQUE (name);


--
-- TOC entry 2412 (class 2620 OID 27334)
-- Dependencies: 329 165 2430
-- Name: trigger_contacts_onupdate_idadress_to_zero; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_contacts_onupdate_idadress_to_zero AFTER UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE trigger_idaddress_to_cero();


--
-- TOC entry 2522 (class 0 OID 0)
-- Dependencies: 2412
-- Name: TRIGGER trigger_contacts_onupdate_idadress_to_zero ON contacts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER trigger_contacts_onupdate_idadress_to_zero ON contacts IS 'Dispara el trigger cuando se setea idaddress = 0. Elimina el registro de la tabla adress.';


--
-- TOC entry 2414 (class 2620 OID 27335)
-- Dependencies: 329 167 2430
-- Name: trigger_phones_onupdate_idaddress_to_zero; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_phones_onupdate_idaddress_to_zero AFTER UPDATE ON phones FOR EACH ROW EXECUTE PROCEDURE trigger_idaddress_to_cero();


--
-- TOC entry 2428 (class 2620 OID 27154)
-- Dependencies: 282 225 2430
-- Name: ts_address; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_address AFTER UPDATE ON address FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2425 (class 2620 OID 26822)
-- Dependencies: 282 211 2430
-- Name: ts_address_city; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_address_city BEFORE UPDATE ON location_city FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2423 (class 2620 OID 26824)
-- Dependencies: 282 207 2430
-- Name: ts_address_country; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_address_country BEFORE UPDATE ON location_country FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2426 (class 2620 OID 26825)
-- Dependencies: 215 282 2430
-- Name: ts_address_sector; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_address_sector BEFORE UPDATE ON location_sector FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2424 (class 2620 OID 26827)
-- Dependencies: 282 209 2430
-- Name: ts_address_states; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_address_states BEFORE UPDATE ON location_states FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2427 (class 2620 OID 26826)
-- Dependencies: 282 217 2430
-- Name: ts_address_subsector; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_address_subsector BEFORE UPDATE ON location_subsector FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2419 (class 2620 OID 26828)
-- Dependencies: 177 282 2430
-- Name: ts_blacklist; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_blacklist BEFORE UPDATE ON blacklist FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2411 (class 2620 OID 26829)
-- Dependencies: 282 165 2430
-- Name: ts_contacts; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_contacts BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2421 (class 2620 OID 26830)
-- Dependencies: 282 182 2430
-- Name: ts_incomingcalls; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_incomingcalls BEFORE UPDATE ON incomingcalls FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2422 (class 2620 OID 26831)
-- Dependencies: 282 200 2430
-- Name: ts_modem; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_modem BEFORE UPDATE ON modem FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2413 (class 2620 OID 26832)
-- Dependencies: 167 282 2430
-- Name: ts_phones; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_phones BEFORE UPDATE ON phones FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2415 (class 2620 OID 26833)
-- Dependencies: 169 282 2430
-- Name: ts_provider; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_provider BEFORE UPDATE ON provider FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2416 (class 2620 OID 26834)
-- Dependencies: 282 171 2430
-- Name: ts_smsin; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_smsin BEFORE UPDATE ON smsin FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2417 (class 2620 OID 26835)
-- Dependencies: 282 173 2430
-- Name: ts_smsout; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_smsout BEFORE UPDATE ON smsout FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2420 (class 2620 OID 26836)
-- Dependencies: 180 282 2430
-- Name: ts_smsoutoptions; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_smsoutoptions BEFORE UPDATE ON smsoutoptions FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2418 (class 2620 OID 26837)
-- Dependencies: 175 282 2430
-- Name: ts_whitelist; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ts_whitelist BEFORE UPDATE ON whitelist FOR EACH ROW EXECUTE PROCEDURE ctrl_ts();


--
-- TOC entry 2407 (class 2606 OID 27124)
-- Dependencies: 215 2382 211 2430
-- Name: fk_idcity_sector; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY location_sector
    ADD CONSTRAINT fk_idcity_sector FOREIGN KEY (idcity) REFERENCES location_city(idcity) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2400 (class 2606 OID 27343)
-- Dependencies: 2350 167 165 2430
-- Name: fk_idcontact; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY phones
    ADD CONSTRAINT fk_idcontact FOREIGN KEY (idcontact) REFERENCES contacts(idcontact) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2405 (class 2606 OID 27092)
-- Dependencies: 2374 209 207 2430
-- Name: fk_idcountry_states; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY location_states
    ADD CONSTRAINT fk_idcountry_states FOREIGN KEY (idcountry) REFERENCES location_country(idcountry) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2403 (class 2606 OID 26709)
-- Dependencies: 177 2352 167 2430
-- Name: fk_idphone; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY blacklist
    ADD CONSTRAINT fk_idphone FOREIGN KEY (idphone) REFERENCES phones(idphone);


--
-- TOC entry 2401 (class 2606 OID 26805)
-- Dependencies: 175 2352 167 2430
-- Name: fk_idphone; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY whitelist
    ADD CONSTRAINT fk_idphone FOREIGN KEY (idphone) REFERENCES phones(idphone);


--
-- TOC entry 2404 (class 2606 OID 26714)
-- Dependencies: 2354 177 169 2430
-- Name: fk_idprovider; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY blacklist
    ADD CONSTRAINT fk_idprovider FOREIGN KEY (idprovider) REFERENCES provider(idprovider) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2402 (class 2606 OID 26810)
-- Dependencies: 169 175 2354 2430
-- Name: fk_idprovider; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY whitelist
    ADD CONSTRAINT fk_idprovider FOREIGN KEY (idprovider) REFERENCES provider(idprovider) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2408 (class 2606 OID 27129)
-- Dependencies: 217 215 2386 2430
-- Name: fk_idsector; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY location_subsector
    ADD CONSTRAINT fk_idsector FOREIGN KEY (idsector) REFERENCES location_sector(idsector) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2410 (class 2606 OID 27214)
-- Dependencies: 229 2356 171 2430
-- Name: fk_idsmsinf_smsout; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY smsin_consumer
    ADD CONSTRAINT fk_idsmsinf_smsout FOREIGN KEY (idsmsin) REFERENCES smsin(idsmsin);


--
-- TOC entry 2409 (class 2606 OID 27190)
-- Dependencies: 227 2358 173 2430
-- Name: fk_idsmsoutf_smsout; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY smsout_consumer
    ADD CONSTRAINT fk_idsmsoutf_smsout FOREIGN KEY (idsmsout) REFERENCES smsout(idsmsout);


--
-- TOC entry 2406 (class 2606 OID 27119)
-- Dependencies: 211 2378 209 2430
-- Name: fk_idstate_city; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY location_city
    ADD CONSTRAINT fk_idstate_city FOREIGN KEY (idstate) REFERENCES location_states(idstate) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2434 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2013-02-11 07:26:38 ECT

--
-- PostgreSQL database dump complete
--

