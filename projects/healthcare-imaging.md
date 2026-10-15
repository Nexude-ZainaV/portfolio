# Healthcare imaging

Digital Image Associate, Holy Name Medical Center, Teaneck, NJ. October 2018
to present.

Eight years on the department side of a hospital's medical imaging system.
This is where I learned to be careful with data, and to explain a technical
problem to someone who just needs it fixed.

---

## The work

- I manage studies in the PACS (X-ray, CT, MRI, ultrasound): importing,
  routing, archiving and retrieving them so radiologists and physicians get
  the images they need on time.
- I do quality control on incoming studies and correct patient and study
  records, following HIPAA rules for access, handling and traceability.
- When imaging software fails, I'm usually the first call. I reproduce the
  problem, work out which layer failed (the device, the network, the archive
  or the vendor's system), and either fix it or write it up clearly enough
  for the vendor to act on.

## DICOM Cleaner Pro

A desktop tool I built on my own initiative. It removes protected health
information from DICOM images before they leave the facility, sends studies
over the DICOM network to a PACS, and exports encrypted ZIP files. It's
packaged as an installer so clinical staff who aren't technical can use it.

Built with Electron, Node.js and Java (PixelMed). The code is private, but I'm
happy to walk through it.

## How it shapes the software I build

I fail closed around sensitive data. When a privacy or safety question can't
be answered, the answer should be the one that can't hurt anyone. The same
instinct runs through [`samples/privacy-predicate`](../samples/privacy-predicate).

I find the layer before I fix anything. Most imaging problems I've solved were
a handoff between two systems, where the data didn't match or a send quietly
failed. A lot of software bugs have the same shape.

And I tell people what happens next. Whoever is calling about a missing study
has a patient in front of them. The first job is to tell them someone is on
it and when they'll hear back.
