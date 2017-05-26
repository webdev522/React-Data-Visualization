________________________________________________________

      Historical archive of APNIC allocation and
                 assignment reports 
                 
             (version 1.0 15 May 2001)
 
Contents:
 - About these reports
 - File format 1.0
 - Conditions of use
________________________________________________________

ABOUT THESE REPORTS


The directory ftp://ftp.apnic.net/pub/stats/apnic/old-format 
is an historical archive of APNIC allocation and assignment
reports produced using file format version 1.0. 

On 5 January 2004, the RIRs adopted file format version 2.0.
To view statistics produced using version 2.0, go to:

  ftp://ftp.apnic.net/pub/stats/apnic/
  
The resources included in these reports are:

  - IPv4 address ranges (IPv4)
  - IPv6 address ranges (IPv6)
  - Autonomous System Numbers (ASNs)

Allocation and assignment reports are produced as part of a 
joint Regional Internet Registry (RIR) project to provide 
consistent and accessible Internet resource statistics to 
the global community. It is hoped these reports will lead
to increased research and analysis of the global use of
address resources.

__________________________________

FILE FORMAT 1.0

These reports are text files, formatted as follows:

* First line:
     version|registry|serial|count|start date|end date|checksum

* Subsequent lines:
     registry|cc|type|start|length|date|status

* Explanation of terms
  version       Version number of this file format (initially "1").
  registry      Name of the RIR.
  serial        Serial number of this file, as appears in the file
                name. This will be the date of production of the file
                in yyyymmdd format.
  count         Number of records in this file.
  start date    First date of the period reported.
  end date      Final date of the period reported.
  checksum      Sum of the length column.
  cc            Country code corresponding to the record 
                (ISO3166, 2-digit format).
  type          Type of resource (IPv4, IPv6, or ASN).
  start         Start of the address resource range.
  length        Length of the address resource range.
  date          Date of registration.
  status        Status of the record (assigned, allocated, reserved).

Please note, these reports do not contain any names or contact details 
of organisations or individuals holding or administering address 
resources.

__________________________________

CONDITIONS OF USE

The files are freely available for download and use on the condition 
that APNIC will not be held responsible for any loss or damage 
arising from the application of the information contained in these 
reports.

APNIC endeavours to the best of its ability to ensure the accuracy 
of these reports; however, APNIC makes no guarantee in this regard.

In particular, it should be noted that these reports seek to 
indicate the country where resources were first allocated or 
assigned. It is not intended that these reports be considered 
as an authoritative statement of the location in which any specific 
resource may currently be in use.

________________________________________________________


If you any questions or comments about these reports, please 
contact <info@apnic.net>

________________________________________________________



