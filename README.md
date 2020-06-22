# MCT Depot
Telemetry depot and web server for Open MCT, developed for the HYPSO student satellite project

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