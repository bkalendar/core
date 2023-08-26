The last part of the pipeline is to transform the timetable into your favorite format. I currently
implemented two:

- [.ical](/src/transformer/ical.ts): The standard format for calendar export.
- [gapi.EventInput](/src/transformer/gapi.ts): Use this with Google Calendar API.

Note that the timetables should be in the [machine](/src/transformer/machine/index.ts)-readable
format first. Please do remember to **reorganize** the timetables first, as explained in the
[README](/src/refine/README.md).
