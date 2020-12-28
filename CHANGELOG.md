# Changelog

## [4.0.5] - 2020-12-28
### Added
- Add New Board task to Windows Taskbar Jump List

### Fixed
 - Fixed an issue where board resize methods would not be called on vertical resize
 - Fixed an issue where the incorrect number of rows were being shown on subsequent pages after resizing the window

### Updated
- Updated Electron and other packages to the latest versions

## [4.0.4] - 2020-07-04
### Added
- Added National Rail Enquiries attribution
- Disabled open board button when API key not set

## [4.0.3] - 2020-07-03
### Fixed
- Fixed an issue where services would be incorrectly sorted
- Fixed an issue where page number input would be parsed as a string

## [4.0.2] - 2020-07-02

### Added
- Arrivals board

### Fixed
- Fixed an issue where board images would not be displayed on Windows

## [4.0.1] - 2020-06-18
### Added
- Support for New Rail Alphabet if installed as a system font
- Command line switch to set API Key

### Fixed
- Fixed an issue where errors would persist after a refresh and services would not be displayed even if successful

## [4.0.0] - 2020-06-15
Rebuilt as a desktop Electron application.

### Added
- Frontend rebuilt using Vue.js (merged from unreleased V3)
- Backend rebuilt using Node.js and Electron JS.

### Removed
- Removed Docker, Laravel
