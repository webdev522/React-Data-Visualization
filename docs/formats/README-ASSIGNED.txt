___________________________________________________________________

APNIC ASSIGNMENT REPORTS
(version 1.0 9 September 2005)
___________________________________________________________________


Contents:

 1. About these reports
 2. Conditions of use
 3. Statistics format



1.	ABOUT ASSIGNMENT REPORTS
____________________________________________________________________

Assignment files contain daily summary reports of the total number
of IP address assignments registered in the APNIC region, sorted by
ISO 3166 country code and prefix length. The assignment statistics
include both publically visible assignments registered in the APNIC
Whois Database as well as private customer assignments.

The resources reported are:

	- IPv4 addresses
	- IPv6 addresses

These reports are produced to provide consistent and accessible
Internet resource statistics on end user IP address consumption
in the APNIC region. It is hoped these reports will lead to
increased research and analysis of the global use of address
resources.

These assignment files use and extend the format used by the
Regional Internet Registries (RIRs) to prodcue allocation and
assignment reports for each RIR. For detailed information on
the RIR statistics exchange format, see:

    http://www.apnic.net/db/rir-stats-format.html



2.	CONDITIONS OF USE
____________________________________________________________________


The files are freely available for download and use on the condition
that APNIC will not be held responsible for any loss or damage
arising from the use of the information contained in these reports.

APNIC endeavours to the best of its ability to ensure the accuracy
of these reports; however, APNIC makes no guarantee in this regard.

In particular, it should be noted that these reports seek to
summarise the number of assignments of a particular prefix length
within a particular economy that have been registered in the public
APNIC Whois Database and the private database. It is not intended
that these reports be considered as an authoritative statement on
the number of assignments actively being routed on the global
Internet.



3.	STATISTICS FORMAT
____________________________________________________________________



3.1 	File names
------------------


Each file is named using the format:

	assigned-apnic-<yyyymmdd>

The most recent file will also be available under the name:

	assigned-apnic-latest



3.2	File format
-------------------

The file consists of:

    - file header lines
	- records

The vertical line character '|' (ASCII code 0x7c) is used as the CSV
field separator.

After the header lines, records are not sorted.



3.2.2 	File header
-------------------

The file header consists of the version line and the summary
lines for each type of record.

Note: the file header is currently included in the comment text
(denoted by the # character at the beginning of each line). The file
header may be uncommented in the future. Any changes to the file will
be publicised on the APNIC web site prior to deployment.


Version line
------------

Format:

  version|registry|serial|records|startdate|enddate|UTCoffset

Where:

  version     format version number of this file, currently 1;

  registry    as for records and filename (see below);

  serial      serial number of this file (within the creating RIR
              series);

  records     number of records in file, excluding blank lines,
              summary lines, the version line and comments;

  startdate   start date of time period, in yyyymmdd format;

  enddate     end date of period in yyyymmdd format;

  UTCoffset   offset from UTC (+/- hours) of local RIR producing file.



Summary line
------------

The summary lines count the number of record lines of each type in
the file.

Format:

  registry|*|type|*|count|summary

Where:

  registry    as for records (see below);

  *           an ASCII '*' (unused field, retained for spreadsheet
              purposes);

  type        as for records (defined below);

  count       sum of the number of record lines of this type in the
              file.

 summary      the ASCII string 'summary' (to distinguish the record
              line);


Note that the count does not equate to the total amount of resources
for each class of record. This is to be computed from the records
themselves.



3.2.2 	Records
---------------

After the defined file header, and excluding any space or comments,
each line in the file represents a particular size of assignment in a
particular economy and how many instances of that assignment have been
made within that economy.

IPv4 records may represent non-CIDR ranges or CIDR blocks, and
therefore the record format represents the beginning of range, and
account. This can be converted to prefix/length using simple algorithms.

IPv6 records represent the prefix and the count of /128 instances under
that prefix.

Format:

  registry|cc|type||value||status|instances

Where:

  registry    The registry from which the data is taken.
			  For APNIC resources, this will be:

                  apnic

  cc          ISO 3166 2-letter code of the organisation to
              which the allocation or assignment was made.
              May also include the following non-ISO 3166
              code:

                  AP  - networks based in more than one
                        location in the Asia Pacific region

  type        Type of Internet number resource represented
              in this record. One value from the set of
              defined strings:

			      {ipv4,ipv6}

  value       In the case of IPv4 address the count of
              hosts for this range. This count does not
              have to represent a CIDR range.

              In the case of an IPv6 address the value
              will be the CIDR prefix length of the assignment


  status      In assignment statistics files, the status will always be:

                  assigned

  instances	  Total number of instances of assignments with specified in
              'value'


3.3 	Historical resources
----------------------------


Early Registration Transfers (ERX) and AUNIC legacy records do not
have any special tagging in the statistics reports.



____________________________________________________________________


If you any questions or comments about these reports, please contact
<technical@apnic.net>

____________________________________________________________________
