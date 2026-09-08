# University of Petra website prototype

A static HTML, CSS, and JavaScript prototype of a new homepage for **University of Petra** (جامعة البترا) in Amman, Jordan.

- **Design:** Recreated from the supplied visual mockup (layout, maroon palette, sections, and components).
- **Content:** Taken from official `uop.edu.jo` pages. Unverified figures were not invented.

## Open locally

Open `index.html` in a browser, or serve the folder:

```powershell
py -m http.server 8080
```

Then visit `http://localhost:8080`.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Homepage matching the reference layout |
| `programs.html` | Nine official faculties |
| `admissions.html` | Requirements, documents, and published 2023–2024 fees |
| `campus-life.html` | Clubs, sports, and female student housing |
| `about.html` | Official overview, vision, and mission |

Apply links go to the official EduGate portal.

## Sources used

- [University homepage](https://www.uop.edu.jo/En/Pages/default.aspx)
- [Overview](https://www.uop.edu.jo/En/MoreAbout/Pages/Overview.aspx)
- [Admission requirements](https://uop.edu.jo/En/AdmissionsAndRegistration/Pages/AdmissionRequirements.aspx)
- Faculty sites: `it`, `eng`, `dentist`, `pharma`, `fafs`, `law`, `arch`, `mass`, `artsci`.uop.edu.jo
- Official campus photographs from `uop.edu.jo/PublishingImages/Slider/`

Hero statistics (7,000 students, 31 nationalities, 9 faculties) are taken from the official overview and incoming-student guidelines.

## Notes

- This is a design prototype, not the live university website.
- Arabic/RTL can be added later; CSS uses logical properties (`margin-inline`, `inset-inline`) to support `dir="rtl"`.
- Lighthouse was not run in this environment if a Chrome audit was unavailable.
