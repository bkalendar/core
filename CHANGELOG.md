# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Calendar Versioning](https://calver.org/), using the scheme `YY.S.PATCH`. The `YY.S`
part should correspond to the current academic year and semester of HCMUT-VNU.

## Unreleased

### Added

- Switch to `jsr.io` package registry.

## [23.3.1] - 2024-06-06

### Fixed

- Fix issue with semester line is not at fixed distance from table header.

## [23.3.0] - 2024-05-10

### Added

- Parse 2024 style timetable.

## [23.2.0] - 2023-12-25

### Fixed

- Fix case-sensitive issue when finding table header.

## [23.1.3] - 2023-10-28

### Fixed

- Fix wrong 23.1.2 deployment.

## [23.1.2] - 2023-10-26 [YANKED]

### Fixed

- Handle `-` in place of empty time (instead of `00:00`).

## [23.1.1] - 2023-09-05

### Fixed

- Handle `--|` weeks.

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
