# 📄 Paperize

> Backup complex secret keys, blockchain wallet secret phrase or any sensitive data into a PGP encrypted QR code file

## Project Description

Secret data are encoded as binary array and encrypted using on of the most secure encryption scheme OpenPGP, a Javascript implementation of PGP. OpenPGP is the most widely used email encryption standard. It is defined by the OpenPGP Working Group of the Internet Engineering Task Force (IETF) as a Proposed Standard in RFC 4880.

After the encryption process, the result is stored as QR code using Javascript QR Code library based on Cosmo Wolfe's javascript port of Google's ZXing library.

Software can be install in any devices with modern internet browser using Chrome v8. All process is perform inside user device without internet interaction, that meen it can work offline for a stronger security and prevent phishing or any network attack.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
