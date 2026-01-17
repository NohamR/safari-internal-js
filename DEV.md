
## Password & Form Autofill System

### **[AutomaticPasswords.js](js/forms/AutomaticPasswords.js)**
Manages Safari's automatic strong password generation:
- Removes auto-generated passwords from password fields
- Controls visibility of suggested strong passwords
- Handles focus/blur events when users interact with password fields
- Manages the "autofilled" state of password inputs

### **[FormMetadata.js](js/forms/FormMetadata.js)**
The brain of Safari's form autofill system:
- **Form Detection & Classification**: Identifies login forms, signup forms, password change forms, and standard forms
- **Smart Field Recognition**: Uses pattern matching, element positioning, visual analysis, and machine learning-like scoring to identify:
  - Username fields
  - Password fields (current, new, confirm)
  - Credit card fields (number, CVV, expiration, cardholder)
  - Address fields (street, city, postal code)
  - Phone numbers (split across multiple fields)
  - Email addresses
  - One-time codes (2FA)

### **[FormMetadataClassification.js](js/forms/FormMetadataClassification.js)**
Intelligently classifies form fields to enable autofill:
- **Identifies field types**: credit cards, names, addresses, phone numbers, emails, birthdays, passwords, etc.
- **Handles multi-part fields**: splits fields like "First Name | Last Name" or phone numbers across multiple inputs
- **Continuation detection**: recognizes when a single piece of data (like credit card number) is split across multiple fields
- **Uses multiple signals**: autocomplete attributes, field names, placeholders, sizes, and positioning
- **Date field parsing**: understands various date formats and splits (day/month/year)
- **Smart matching**: uses pattern recognition to classify fields even without explicit HTML hints

### **[FormMetadataContactsAutoFillMappings.js](26.2/js/forms/FormMetadataContactsAutoFillMappings.js)** *(New in 26.2)*
Mappings between form fields and Contacts data:
- Defines relationships between HTML form fields and Contact card properties
- Maps autofill field types to vCard/Contacts attributes
- Handles address components (street, city, state, postal code)
- Contact information mapping (name, email, phone, organization)
- Enables seamless autofill from Contacts app

### **[FormMetadataJSController.js](26.2/js/forms/FormMetadataJSController.js)** *(New in 26.2)*
JavaScript bridge for form metadata operations:
- Provides communication layer between native code and web content
- Manages form field metadata collection and updates
- Coordinates autofill operations across different contexts
- Handles form submission and validation events

### **[FormMetadataUtilities.js](26.2/js/forms/FormMetadataUtilities.js)** *(New in 26.2)*
Utility functions for form processing:
- Helper functions for form element analysis
- Field value normalization and validation
- Common patterns for field identification
- Shared utilities used across form metadata modules

### **[PasswordRulesParserJS.js](26.2/js/forms/PasswordRulesParserJS.js)** *(New in 26.2)*
Parses password requirement rules:
- Implements password rules format parsing (as per WHATWG spec)
- Interprets password requirements from websites
- Generates strong passwords that meet specific site requirements
- Handles character classes (uppercase, lowercase, digits, special)
- Validates password constraints (min/max length, required/allowed characters)

### **[NodePath.js](js/utilities/NodePath.js)**
Creates stable references to DOM elements:
- **Path-based element identification**: creates a "fingerprint" for DOM nodes that works even when the DOM changes
- **Fuzzy matching**: uses similarity scoring (Levenshtein distance) to relocate elements after page updates
- **Handles shadow DOM and iframes**: traverses across shadow boundaries and iframe documents
- **Range support**: can reference text selections, not just elements
- **Resilient resolution**: uses multiple strategies (CSS selectors, position, attributes) to find elements

---

## Reader Mode System

### **[Reader.html](html/Reader.html)**
The HTML template that powers Safari's Reader Mode interface:
- **Complete CSS styling**: 1300+ lines of carefully crafted styles for article display
- **AI Summary UI**: Collapsible summary sections with smooth animations and expand/collapse controls
- **Table of Contents**: Sidebar navigation with styled list items and separators
- **Theme support**: CSS variables for White, Sepia, Gray, and Night themes
- **Responsive typography**: Styles for headings, paragraphs, blockquotes, figures, and captions
- **Watch support**: Specialized styles for Apple Watch display
- **Rich content styling**: Tables, code blocks, pull quotes, and floating images
- **Accessibility**: Proper focus states and interactive button styling

### **[Reader.js](js/reader/Reader.js)**
Powers Safari's Reader Mode core functionality:
- Manages visibility transitions for Reader view
- Handles iframe URL caching/restoration when entering/exiting Reader
- Checks JavaScript enablement settings
- Mac-specific UI adjustments

### **[ReaderArticleFinder.js](js/reader/ReaderArticleFinder.js)** (~3500 lines)
Safari's article detection and cleaning algorithm (similar to Mozilla's Readability):

**Article Detection Strategies:**
1. Schema.org metadata (`<article itemtype="Article">`)
2. OpenGraph tags (`<meta property="og:type" content="article">`)
3. Visual examination (hit-testing specific screen coordinates)
4. Quirks list for known sites (NYTimes, Medium, etc.)

**Scoring System:**
- Text density analysis
- Link density (fewer links = more likely article)
- Tag names (article, main, section boost score)
- Class names ("article", "content" boost; "comment", "sidebar" reduce)
- Position on page
- Font consistency

**Smart Cleaning:**
- Removes ads, comments, navigation
- Keeps images, videos, tweets
- Converts lazy-loaded images
- Preserves tables and code blocks
- Handles multi-column layouts
- Detects CJK (Chinese, Japanese, Korean) text using Unicode ranges

### **[ReaderShared.js](26.2/js/reader/ReaderShared.js)** *(New in 26.2)*
Shared utilities for Reader Mode:
- Common functions used across Reader Mode components
- Text processing and article content utilities
- DOM manipulation helpers specific to Reader Mode
- Coordinate Reader behavior between different modules

### **[ReaderSharedUI.js](js/reader/ReaderSharedUI.js)**
Powers the actual Reader Mode interface:

**Layout Management:**
- Multi-column pagination for long articles
- Responsive design adapting to window size
- 12+ font families (System, Charter, Georgia, Iowan, Palatino, etc.)
- 4 themes: White, Sepia, Gray, Night
- 12 text size levels with custom line heights per font

**Interactive Features:**
- Smooth scrolling with animations
- Content-aware navigation (stops at natural break points)
- Next page auto-loading for paginated articles
- Print/email formatting
- Reading position memory
- Table of Contents generation from headings
- AI-generated summary display with collapsible UI
- Sidebar for TOC/summary on wide screens

### **[ReaderSharedUINormalWorld.js](js/reader/ReaderSharedUINormalWorld.js)**
Enhances Reader Mode with rich content:
- **Twitter/X integration**: replaces simple tweet embeds with rich Twitter widgets
- Loads Twitter's widget JavaScript on demand
- Handles transition from placeholder tweets to interactive embeds

---

## Web Page Analysis & Data Extraction

### **[SchemaDataExtractor.js](js/schema/SchemaDataExtractor.js)**
Extracts contact information from web pages:
- Parses **Microdata** markup (HTML attributes like `itemscope`, `itemprop`)
- Parses **JSON-LD** structured data (schema.org formatted JSON)
- Extracts addresses, phone numbers, business names
- Enables Safari's "Add to Contacts" feature

### **[SchemaOrgMarkupChecker.js](js/schema/SchemaOrgMarkupChecker.js)**
Simple detection utility:
- Returns `true` if page contains schema.org structured data
- Checks both JSON-LD scripts and microdata attributes
- Used to determine if page has extractable structured information

### **[MetadataExtractor.js](js/metadata/MetadataExtractor.js)**
Extracts website icons and branding:
- Favicon URLs
- Apple Touch icons (for iOS home screen)
- Template icons with colors
- Sorts icons by size/quality

### **[WebContentLayoutAnalyzer.js](js/layout/WebContentLayoutAnalyzer.js)**
Analyzes page responsive design:
- Detects centered container elements
- Determines if containers have fixed width (non-responsive)
- Measures container movement during window resize
- Helps Safari optimize reader mode and display adjustments

---

## Search & Discovery

### **[OpenSearchURLFinder.js](js/search/OpenSearchURLFinder.js)**
Enables custom search engine discovery:
- Finds `<link rel="search">` tags in page header
- Powers Safari's search engine discovery feature
- Allows users to add custom search engines from websites

### **[QuickWebsiteSearchURLDetector.js](26.2/js/search/QuickWebsiteSearchURLDetector.js)** *(New in 26.2)*
Detects website search capabilities:
- Analyzes web pages for search functionality
- Identifies search forms and input fields
- Extracts search URL patterns from website structure
- Enables Safari's Quick Website Search feature
- Automatically discovers site-specific search without OpenSearch tags

---

## Localization & Translation

### **[Translation.js](js/translation/Translation.js)**
Manages language attributes during translation:
- Updates page's `lang` attribute when Safari translates content
- Ensures accessibility tools and screen readers recognize current language

---

## Save & Archive

### **[SavePageInliningOrDiscardingExternalResources.js](js/utilities/SavePageInliningOrDiscardingExternalResources.js)**
Creates self-contained web archives:
- Copies all HTML elements and their styles
- Inlines CSS from stylesheets into the document
- Converts external resource URLs to local filenames
- Removes scripts, objects, and dynamic content
- Recursively captures iframe content
- Powers Safari's "Save As Web Archive" feature