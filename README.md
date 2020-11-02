# MCT Depot
Telemetry depot and web server for Open MCT, developed for the HYPSO student satellite project. The project report documenting the design and implementation of MCT Depot is available [here](./docs/NTNU_Project_Report_AVN_V2020.pdf).

## System structure
<p align="center">
<img src="./docs/imgs/Block Diagram (early).svg"><br>
Early high-level system block diagram
</p>

---

<p align="center">
<img src="./docs/imgs/Data Flow Diagram (L0).svg"><br>
System data flow diagram (level 0)
</p>

---

<p align="center">
<img src="./docs/imgs/Class Diagram.svg"><br>
Class diagram
</p>

## Notes
Important note regarding package.json and running this on Windows: The latest public OpenMCT release does not build on Windows due to a path issue. A pull request has been submitted for this and should hopefully be accepted soon, but until then this repo is using a fork of the official OpenMCT repo with a fix for the Windows build issue.

 - npm install
 - npm run start
 - npm run test

## Server requirements
MCT Depot is fairly I/O-bound, as it does little processing after telemetry samples have been stored in its database but often needs to supply large amounts of data when Open MCT is rendering complex combined views, or views with large amounts of historical data. It is thus recommended to keep the SQLite database on a fairly fast drive (such as an SSD), with at least a few gigabytes of free space set aside per month of telemetry data it should handle (although this depends heavily on the detail level of the telemetry data stored).

As for non-I/O requirements, it should run alright on most things; 512 MB of free memory should in most instances be enough for the application itself, along with two or more CPU threads offering alright single-threaded performance.

### Summary (minimum requirements)
 - 512 MB or more of free memory
 - 1 GB or more of free space

### Summary (recommended requirements)
 - 1 GB or more of free memory
 - 10 GB or more of free space on a fast drive, with 2-3 GB extra per month of telemetry samples depending on size per sample and sample rate
 - Two or more available CPU threads with good single-threaded performance