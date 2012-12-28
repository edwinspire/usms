using GLib;
using Gee;
using Sqlite;
using edwinspire.uSMS;
using edwinspire.Ports;


namespace edwinspire.uSMS{

public const string FILECONF = "usmsd.sqlite";



public class ProcessControldb:GLib.Object{

public int Id = 0;
public string Date = "";
public ProcessCtrl Ctrl = ProcessCtrl.None;
public string Note = "";

public ProcessControldb(int id = 0, ProcessCtrl ctrl = ProcessCtrl.None, string note = "", string date = "2000-01-01 00:00"){
Id = id;
Date = date;
Ctrl = ctrl;
Note = note;
}

public ProcessControldb.from_string(string? id, string? ctrl, string? note = "", string? date = "2000-01-01 00:00"){

if(id!=null){
Id = int.parse(id);
}else{
Id = 0;
}

if(date != null){
Date = date;
}else{
Date = "2000-01-01";
}

if(ctrl != null){
Ctrl = (ProcessCtrl)int.parse(ctrl);
}else{
Ctrl = ProcessCtrl.None;
}

if(note != null){
Note = note;
}else{
Note = "";
}

}

}

public class TableProcessControl:GLib.Object{

public TableProcessControl(){


}

public static int64 Insert(ProcessControldb row){

int64 Retorno = 0;
    Database db;
    Statement stmt;
    int rc = 0;
string query = "INSERT INTO processcontrol (control, note) VALUES (?, ?)";
  //  int cols;

    if ((rc = Database.open (FILECONF, out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
    //    return;
    }

    if ((rc = db.prepare_v2 (query, -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d %s\n[%s], %s\n", rc, query, FILECONF, db.errmsg ());
//        return;
    }

if(stmt != null){
//stmt.bind_int(1, row.Id);
stmt.bind_int(1, (int)row.Ctrl);
stmt.bind_text(2, row.Note);

stmt.step();
//  printerr ("SQL %s\n", db.errmsg ());
db.exec("COMMIT");
        printerr ("SQL changes del: %d, %i\n", rc, db.changes ());
if(db.changes ()>0){
Retorno = db.last_insert_rowid ();
}
}
return Retorno;
}



//***********************************************
// Obtiene todas las configuracion registradas en la base de datos
[Description(nick = "Update row", blurb = "")]
public static bool Update(ProcessControldb contrl){
bool Retorno = false;
var Query = new StringBuilder();

    Database db;
    Statement stmt;
    int rc = 0;

    if ((rc = Database.open (FILECONF, out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
  //      return;
    }

Query.append("UPDATE processcontrol SET note = ? WHERE id = ?");

    if ((rc = db.prepare_v2 (Query.str, -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d, %s\n", rc, db.errmsg ());
//        return;
    }

if(stmt != null){
/*
stmt.bind_text(1, conf.Root);
stmt.bind_int(2, conf.Port);
stmt.bind_int(3, (int)conf.Enable);
*/
stmt.bind_text(1, contrl.Note);
//stmt.bind_text(5, conf.HomePage);
stmt.bind_int(2, contrl.Id);

stmt.step();

//print(stmt.sql());
  //      printerr ("SQL error: %d, %s\n", rc, db.errmsg ());
      //  printerr ("SQL %s\n", stmt.sql());
db.exec("COMMIT");

//        printerr ("SQL changes: %d, %i\n", rc, db.changes ());

if(db.changes ()>0){
Retorno = true;
}
}
  //    printerr ("SQL error: %d, %s\n", rc, db.errmsg ());
//        printerr ("SQL changes: %d, %i\n", rc, db.changes ());
return Retorno;
}



//***********************************************
// 
public static ProcessControldb RowById(int Id){

var Retorno = new ProcessControldb();
//print("Cargando configuracion de UiWeb server\n");
    Database db;
    Statement stmt;
    int rc = 0;
    int cols;
    if ((rc = Database.open (FILECONF, out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
    //    return;
    }
    if ((rc = db.prepare_v2 ("SELECT * FROM processcontrol WHERE id = "+Id.to_string(), -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d [%s], %s\n", rc, FILECONF, db.errmsg ());
//        return;
    }
    cols = stmt.column_count();
    do {
        rc = stmt.step();
        switch (rc) {
        case Sqlite.DONE:
            break;
        case Sqlite.ROW:
//print("Puert %s\n", ((bool)stmt.column_int(2)).to_string());

Retorno.Id = stmt.column_int(0);
Retorno.Date = stmt.column_text(1);
Retorno.Ctrl =  (ProcessCtrl)stmt.column_int(2);
Retorno.Note = stmt.column_text(3);

//Retorno.add(Puerto);

            break;
        default:
            printerr ("Error: %d, %s\n", rc, db.errmsg ());
            break;
        }
    } while (rc == Sqlite.ROW);

return Retorno;
}

//***********************************************
// 
public static ProcessControldb Last(){

var Retorno = new ProcessControldb();
//print("Cargando configuracion de UiWeb server\n");
    Database db;
    Statement stmt;
    int rc = 0;
    int cols;
    if ((rc = Database.open (FILECONF, out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
    //    return;
    }
    if ((rc = db.prepare_v2 ("SELECT * FROM processcontrol ORDER BY id DESC LIMIT 1", -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d [%s], %s\n", rc, FILECONF, db.errmsg ());
//        return;
    }
    cols = stmt.column_count();
    do {
        rc = stmt.step();
        switch (rc) {
        case Sqlite.DONE:
            break;
        case Sqlite.ROW:
Retorno.Id = stmt.column_int(0);
Retorno.Date = stmt.column_text(1);
Retorno.Ctrl =  (ProcessCtrl)stmt.column_int(2);
Retorno.Note = stmt.column_text(3);

//Retorno.add(Puerto);

            break;
        default:
            printerr ("Error: %d, %s\n", rc, db.errmsg ());
            break;
        }
    } while (rc == Sqlite.ROW);

return Retorno;
}

public static ArrayList<ProcessControldb> All(){

var Retorno = new ArrayList<ProcessControldb>();
//print("Cargando configuracion de UiWeb server\n");
    Database db;
    Statement stmt;
    int rc = 0;
    int cols;
    if ((rc = Database.open (FILECONF, out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
    //    return;
    }
    if ((rc = db.prepare_v2 ("SELECT * FROM processcontrol ORDER BY id DESC", -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d [%s], %s\n", rc, FILECONF, db.errmsg ());
//        return;
    }
    cols = stmt.column_count();
    do {
        rc = stmt.step();
        switch (rc) {
        case Sqlite.DONE:
            break;
        case Sqlite.ROW:
//print("Puert %s\n", ((bool)stmt.column_int(2)).to_string());
ProcessControldb PC = new ProcessControldb();
PC.Id = stmt.column_int(0);
PC.Date = stmt.column_text(1);
PC.Ctrl =  (ProcessCtrl)stmt.column_int(2);
PC.Note = stmt.column_text(3);

Retorno.add(PC);

            break;
        default:
            printerr ("Error: %d, %s\n", rc, db.errmsg ());
            break;
        }
    } while (rc == Sqlite.ROW);

return Retorno;
}



}

//****************************************
//****************************************
public class TableSerialPort:GLib.Object{

public TableSerialPort(){

}


//***********************************************
// Lista de puertos
public static ArrayList<SerialPortConf> All(){

var Retorno = new ArrayList<SerialPortConf>();

    Database db;
    Statement stmt;
    int rc = 0;
    int cols;
    if ((rc = Database.open (FILECONF, out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
    //    return;
    }
    if ((rc = db.prepare_v2 ("SELECT * FROM serialport", -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d [%s], %s\n", rc, FILECONF, db.errmsg ());
//        return;
    }
    cols = stmt.column_count();
    do {
        rc = stmt.step();
        switch (rc) {
        case Sqlite.DONE:
            break;
        case Sqlite.ROW:
//print("Puert %s\n", ((bool)stmt.column_int(2)).to_string());
SerialPortConf Puerto = new SerialPortConf();
Puerto.Id = stmt.column_int(0);
Puerto.Enable = (bool)stmt.column_int(2);
Puerto.Port =  stmt.column_text(1);
Puerto.BaudRate = stmt.column_int(3);
Puerto.DataBits = stmt.column_int(4);
Puerto.HandShake = (Ports.HandShaking)stmt.column_int(7);
Puerto.Parityp = (Ports.Parity)stmt.column_int(5);
Puerto.StopBitsp = (Ports.StopBits)stmt.column_int(6);
Puerto.Note = stmt.column_text(8);

Retorno.add(Puerto);

            break;
        default:
            printerr ("Error: %d, %s\n", rc, db.errmsg ());
            break;
        }
    } while (rc == Sqlite.ROW);

return Retorno;
}

// Lista de puertos habilitados
public static ArrayList<SerialPortConf> Enables(){

var Retorno = new ArrayList<SerialPortConf>();
foreach(var Puerto in All()){
//print("Puert> %s\n", (Puerto.Enable).to_string());
if(Puerto.Enable){
Retorno.add(Puerto);
}
}
return Retorno;
}

public static int64 Insert(SerialPortConf row){

int64 Retorno = 0;

    Database db;
    Statement stmt;
    int rc = 0;
  //  int cols;

    if ((rc = Database.open (FILECONF, out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
    //    return;
    }

    if ((rc = db.prepare_v2 ("INSERT INTO FROM serialport (idport, port, enable, baudrate, databits, parity, stopbits, handshake, timeout, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d [%s], %s\n", rc, FILECONF, db.errmsg ());
//        return;
    }

if(stmt != null){
stmt.bind_int(1, (int)row.Id);
stmt.bind_text(2, row.Port);
stmt.bind_int(3, (int)row.Enable);
stmt.bind_int(4, (int)row.BaudRate);
stmt.bind_int(5, (int)row.DataBits);
stmt.bind_int(6, (int)row.Parityp);
stmt.bind_int(7, (int)row.StopBitsp);
stmt.bind_int(8, (int)row.HandShake);
stmt.bind_int(9, (int)row.TimeOut);
stmt.bind_text(10, row.Note);

stmt.step();
      //  printerr ("SQL %s\n", stmt.sql());
db.exec("COMMIT");
        printerr ("SQL changes del: %d, %i\n", rc, db.changes ());
if(db.changes ()>0){
Retorno = db.last_insert_rowid ();
}
}
return Retorno;
}

public static bool Update(SerialPortConf row){
bool Retorno = false;
    Database db;
    Statement stmt;
    int rc = 0;
  //  int cols;

    if ((rc = Database.open (FILECONF, out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
    //    return;
    }

    if ((rc = db.prepare_v2 ("UPDATE serialport SET port = ?, enable = ?, baudrate = ?, databits = ?, parity = ?, stopbits = ?, handshake = ?, timeout = ?, note = ? WHERE idport = ?", -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d [%s], %s\n", rc, FILECONF, db.errmsg ());
//        return;
    }

if(stmt != null){

stmt.bind_text(1, row.Port);
stmt.bind_int(2, (int)row.Enable);
stmt.bind_int(3, (int)row.BaudRate);
stmt.bind_int(4, (int)row.DataBits);
stmt.bind_int(5, (int)row.Parityp);
stmt.bind_int(6, (int)row.StopBitsp);
stmt.bind_int(7, (int)row.HandShake);
stmt.bind_int(8, (int)row.TimeOut);
stmt.bind_text(9, row.Note);
stmt.bind_int(10, (int)row.Id);

stmt.step();
      //  printerr ("SQL %s\n", stmt.sql());
db.exec("COMMIT");
        printerr ("SQL changes del: %d, %i\n", rc, db.changes ());
if(db.changes ()>0){
Retorno = true;
}
}
return Retorno;
}

public static bool Delete(uint IdPort){
bool Retorno = false;
    Database db;
    Statement stmt;
    int rc = 0;
  //  int cols;

    if ((rc = Database.open (FILECONF, out db)) == 1) {
        printerr ("Can't open database: %s\n", db.errmsg ());
    //    return;
    }

    if ((rc = db.prepare_v2 ("DELETE FROM serialport WHERE idport = ?", -1, out stmt, null)) == 1) {
        printerr ("SQL error: %d [%s], %s\n", rc, FILECONF, db.errmsg ());
//        return;
    }

if(stmt != null){

stmt.bind_int(1, (int)IdPort);

stmt.step();
      //  printerr ("SQL %s\n", stmt.sql());
db.exec("COMMIT");
        printerr ("SQL changes del: %d, %i\n", rc, db.changes ());
if(db.changes ()>0){
Retorno = true;
}
}
return Retorno;
}



}


















}
