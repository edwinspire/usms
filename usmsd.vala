//
//
//  Author:
//       Edwin De La Cruz <admin@edwinspire.com>
//
//  Copyright (c) 2013 edwinspire
//  Web Site http://edwinspire.com
//
//  Quito - Ecuador
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

using GLib;
using edwinspire.uSMS;

//using Gee;

//using edwinspire.UiWeb.Server;
//using Xml;

public class RunuSMS: GLib.Object {

	public static int main (string[] args) {
		stdout.printf ("run usmsd!\n");

uSMSServer smsServer = new uSMSServer();
//smsServer.ResetAndLoadDevices();
smsServer.Run();

print("El servidor muere...");
		return 0;
	}




}




