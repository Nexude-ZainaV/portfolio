# Healthcare imaging

**Digital Image Associate, Holy Name Medical Center, Teaneck, NJ.** October 2018 to present.

Eight years on the department side of a hospital's medical imaging system. This is where I learned
to be careful with data, and to explain a technical problem to someone who just needs it fixed.

---

## The work

- **Managing studies in the PACS** (X-ray, CT, MRI, ultrasound): importing, routing, archiving and
  retrieving them so radiologists and physicians get the images they need on time.
- **Quality control:** checking incoming studies and correcting patient and study records under HIPAA
  rules for access, handling and traceability.
- **First point of contact when imaging software fails.** I reproduce the problem, work out which layer
  failed (the device, the network, the archive, or the vendor's system), and either fix it or write it
  up clearly enough for the vendor to act on.

## DICOM Cleaner Pro

A desktop tool I built on my own initiative. It **removes protected health information from DICOM
images** before they leave the facility, sends studies over the DICOM network to a PACS, and exports
encrypted ZIP files. It is packaged as an installer so non-technical clinical staff can use it.

Built with Electron, Node.js and Java (PixelMed). The code is private; I'm happy to walk through it.

## How it shapes the software I build

- **Fail closed around sensitive data.** When a privacy or safety question can't be answered, the
  answer is the one that can't hurt anyone. The same instinct runs through
  [`samples/privacy-predicate`](../samples/privacy-predicate).
- **Find the layer, then fix the cause.** Most imaging problems I've fixed were a handoff between two
  systems where the data didn't match or a send quietly failed. Most software bugs I've fixed have the
  same shape.
- **Tell people what happens next.** The person calling about a missing study has a patient in front
  of them. The first job is to tell them someone is on it and when they'll hear back.
