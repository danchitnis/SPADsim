# SPAD Sim

An online simulator for [Single Avalanche Photo Diode (SPAD)](https://en.wikipedia.org/wiki/Single-photon_avalanche_diode)

See the online demo [here 🚀](https://danchitnis.github.io/SPADsim/index.html)

## What are these pulses on the screen

The pulses replicate the pulses when connect a SPAD circuit to an oscilloscope. There are various type of SPADs and biasing schemes, this is representing a single SPAD with passive quenching

## What is a SPAD?

a SPAD is light detector which is sensitive to a single photon, and upon detection of a single photon, it gives a digital-like output pulse, hence significantly simplifying the readout mechanism in comparison to a photodiode (PD) and avalanche photodiode (APD). Of course, the SPAD has an detection efficiency, and it is in fact sensitive to every few photons.

## Where can I get a SPAD?

Unfortunately you cannot. Currently, there is no market for single SPADs. However, you can find these as wildly expensive scientific components, and in form of SiPM or MPPC arrays. There are various range detectors and smartphone cameras which use SPADs, however you cannot access the SPAD itself for propriety reasons.

## Can I make a SPAD myself?

If you are familiar with the world of integrated circuits, then it is very easy to make a SPAD. Simply follow academic publications in the past decade. You may be able to convert APDs into SPAD at higher voltages.

## Why and when to use this simulator

This simulator helps in understating of SPAD operations and how it can be used in a specific application.

## Which SPAD parameters are represented

The recovery time (for passive quenching), photon rate, and threshold voltage (of the digital inverter) are represented. All the units are arbitery. Notice that the dark count is not included, hence the photon rate is more accurately represented as an "event" rate.

## Build instruction

install [Git](https://git-scm.com/) and [NodeJS](https://nodejs.org/en/) which also includes NPM. Then in your workspace:

```bash
git clone https://github.com/danchitnis/SPADsim.git
cd SPADsim
npm i
npm run build
```

## How to contribute

you can create Github issue to report a bug or mention a feature request

## License

Please see the license notice.
