# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Calendar Versioning](https://calver.org/), using the scheme `YY.MINOR.PATCH`. The `YY`
part should correspond to the current academic year of HCMUT-VNU.

## [Unreleased]

## [23.1.0] - 2023-09-01

### Added

- Parser for postgrads' timetable.

### Fixed

- Add snapshot tests for lecturer timetables.

## [23.0.0] - 2023-08-31

### Added

- Parser for students and lecturers' timetable.
- Resolver for first date of semester.
- Formatter for `.ics` and Google Calendar.
- Errors throwing inside parser and resolver.
- Snapshot tests for basic cases.
