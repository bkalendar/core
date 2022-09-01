# @bkalendar/core

<a href="https://npmjs.org/package/@bkalendar/core">
  <img src="https://img.shields.io/npm/v/@bkalendar/core.svg"
       alt="npm version">
</a>

In an effort to transform the HCMUT timetable format to other format like iCalendar, I made this
package.

Our school timetable site is doing its worst job at representing timetables:

-   From the machine-readable viewpoint: working with weeks with no year attached is pain. This
    leads to ambiguity documented below in the [Reorganize the timetables](/src/refine/README.md) section.
-   From the human-readable viewpoint: I agree that there is `table` inside `timetable`, but it is
    not a reason to just [use a table to represent something akin to a calendar][steve].

    (Well, could be just personal taste though.)

    [steve]: https://twitter.com/steveschoger/status/997125312411570176

Further information can be found in other READMEs:

-   [parser](/src/parser/README.md): parse the timetables.
-   [transformer](/src/transformer/README.md): transform the timetables into formats.
-   [refine](/src/refine/README.md): do stuff with the parsed timetables.
