//# sourceURL=__InjectedScript_SchemaDataExtractor.js
/* Copyright (c) 2025 Apple Inc. All rights reserved. */
var SchemaDataExtractor = function () {};
((SchemaDataExtractor.validAddressProperties = {
  addressCountry: 1,
  addressLocality: 1,
  addressRegion: 1,
  postOfficeBoxNumber: 1,
  postalCode: 1,
  streetAddress: 1,
}),
  (SchemaDataExtractor.validParentSchemaTypes = {
    "http://schema.org/Person": 1,
    "https://schema.org/Person": 1,
    "http://schema.org/LocalBusiness": 1,
    "https://schema.org/LocalBusiness": 1,
    "http://schema.org/Organization": 1,
    "https://schema.org/Organization": 1,
    "http://schema.org/Restaurant": 1,
    "https://schema.org/Restaurant": 1,
    "http://schema.org/Corporation": 1,
    "https://schema.org/Corporation": 1,
    "http://schema.org/EducationalOrganization": 1,
    "https://schema.org/EducationalOrganization": 1,
    "http://schema.org/GovernmentOrganization": 1,
    "https://schema.org/GovernmentOrganization": 1,
    "http://schema.org/MedicalOrganization": 1,
    "https://schema.org/MedicalOrganization": 1,
    "http://schema.org/AnimalShelter": 1,
    "https://schema.org/AnimalShelter": 1,
    "http://schema.org/AutomotiveBusiness": 1,
    "https://schema.org/AutomotiveBusiness": 1,
    "http://schema.org/ChildCare": 1,
    "https://schema.org/ChildCare": 1,
    "http://schema.org/DryCleaningOrLaundry": 1,
    "https://schema.org/DryCleaningOrLaundry": 1,
    "http://schema.org/EmergencyService": 1,
    "https://schema.org/EmergencyService": 1,
    "http://schema.org/EmploymentAgency": 1,
    "https://schema.org/EmploymentAgency": 1,
    "http://schema.org/EntertainmentBusiness": 1,
    "https://schema.org/EntertainmentBusiness": 1,
    "http://schema.org/FinancialService": 1,
    "https://schema.org/FinancialService": 1,
    "http://schema.org/FoodEstablishment": 1,
    "https://schema.org/FoodEstablishment": 1,
    "http://schema.org/GovernmentOffice": 1,
    "https://schema.org/GovernmentOffice": 1,
    "http://schema.org/HealthAndBeautyBusiness": 1,
    "https://schema.org/HealthAndBeautyBusiness": 1,
    "http://schema.org/HomeAndConstructionBusiness": 1,
    "https://schema.org/HomeAndConstructionBusiness": 1,
    "http://schema.org/InternetCafe": 1,
    "https://schema.org/InternetCafe": 1,
    "http://schema.org/LegalService": 1,
    "https://schema.org/LegalService": 1,
    "http://schema.org/Library": 1,
    "https://schema.org/Library": 1,
    "http://schema.org/LodgingBusiness": 1,
    "https://schema.org/LodgingBusiness": 1,
    "http://schema.org/ProfessionalService": 1,
    "https://schema.org/ProfessionalService": 1,
    "http://schema.org/RadioStation": 1,
    "https://schema.org/RadioStation": 1,
    "http://schema.org/RealEstateAgent": 1,
    "https://schema.org/RealEstateAgent": 1,
    "http://schema.org/RecyclingCenter": 1,
    "https://schema.org/RecyclingCenter": 1,
    "http://schema.org/SelfStorage": 1,
    "https://schema.org/SelfStorage": 1,
    "http://schema.org/ShoppingCenter": 1,
    "https://schema.org/ShoppingCenter": 1,
    "http://schema.org/SportsActivityLocation": 1,
    "https://schema.org/SportsActivityLocation": 1,
    "http://schema.org/Store": 1,
    "https://schema.org/Store": 1,
    "http://schema.org/TelevisionStation": 1,
    "https://schema.org/TelevisionStation": 1,
    "http://schema.org/TouristInformationCenter": 1,
    "https://schema.org/TouristInformationCenter": 1,
    "http://schema.org/TravelAgency": 1,
    "https://schema.org/TravelAgency": 1,
  }),
  (SchemaDataExtractor.validBaseSchemaTypes = {
    "http://schema.org/PostalAddress": 1,
    "https://schema.org/PostalAddress": 1,
  }),
  (SchemaDataExtractor.containsSchemaOrgKey = "containsSchemaOrg"),
  (SchemaDataExtractor.containsMicrodataKey = "containsMicrodata"),
  (SchemaDataExtractor.schemaOrgTypeDomain = "schema.org"),
  (SchemaDataExtractor.prototype = {
    isValidParentSchemaType: function (t) {
      return SchemaDataExtractor.validParentSchemaTypes[t];
    },
    isValidBaseSchemaType: function (t) {
      return SchemaDataExtractor.validBaseSchemaTypes[t];
    },
    extractFilteredSchemaValuesFromMicroData: function () {
      const t = document.querySelectorAll("[itemscope]");
      let e = [],
        r = [],
        a = !1;
      for (let o of t) {
        let t = o.getAttribute("itemType");
        t &&
          (this.isValidParentSchemaType(t) && e.push(o),
          this.isValidBaseSchemaType(t) && r.push(o),
          !a &&
            t.includes(SchemaDataExtractor.schemaOrgTypeDomain) &&
            (a = !0));
      }
      let o = {};
      if (!a) return o;
      if (((o[SchemaDataExtractor.containsSchemaOrgKey] = !0), 1 !== r.length))
        return o;
      const s = r[0],
        c = s.getAttribute("itemtype");
      if (!c || -1 === c.indexOf("PostalAddress")) return o;
      const n = s.querySelectorAll("[itemprop]");
      for (let t of n) {
        let e = t.getAttribute("itemprop");
        e &&
          SchemaDataExtractor.validAddressProperties[e] &&
          (o[e] = t.textContent ? t.textContent : t.getAttribute("content"));
      }
      let h = s.parentNode;
      for (; null !== h && -1 === e.indexOf(h); ) h = h.parentNode;
      const i = s.querySelectorAll("[itemprop='telephone']");
      if (null !== h) {
        let t = h.querySelectorAll("[itemprop='name']");
        (t.length && (o.name = t[0].textContent),
          0 === i.length && (i = h.querySelectorAll("[itemprop='telephone']")));
      }
      return (i.length && (o.telephone = i[0].textContent), o);
    },
    extractAllSchemaValuesFromMicroData: function () {
      const t = document.querySelectorAll("[itemscope]");
      let e = [],
        r = !1;
      for (let a of t) {
        const t = a.getAttribute("itemType");
        t &&
          (e.push(a),
          !r &&
            t.includes(SchemaDataExtractor.schemaOrgTypeDomain) &&
            (r = !0));
      }
      let a = {};
      if (!r) return a;
      if (((a[SchemaDataExtractor.containsSchemaOrgKey] = !0), 1 !== e.length))
        return a;
      const o = e[0],
        s = (o.getAttribute("itemtype"), o.querySelectorAll("[itemprop]"));
      for (let t of s) {
        let e = t.getAttribute("itemprop");
        e && (a[e] = t.textContent ? t.textContent : t.getAttribute("content"));
      }
      return a;
    },
    extractFilteredSchemaValuesFromJSONLD: function () {
      let t = {};
      const e = document.querySelector('script[type="application/ld+json"]');
      if (!e) return t;
      let r;
      try {
        r = JSON.parse(e.text);
      } catch (e) {
        return t;
      }
      let a = r["@context"];
      if ("http://schema.org" !== a && "https://schema.org" !== a) return t;
      t[SchemaDataExtractor.containsSchemaOrgKey] = !0;
      let o = [];
      for (o.unshift(r); o.length; ) {
        let e = o.shift();
        if (null != e) {
          if (
            (Object.prototype.hasOwnProperty.call(e, "telephone") &&
              (t.telephone = e.telephone),
            "PostalAddress" === e["@type"])
          ) {
            for (let r in e)
              SchemaDataExtractor.validAddressProperties[r] && (t[r] = e[r]);
            break;
          }
          for (let t in e) {
            let r = e[t];
            "object" == typeof r && o.push(r);
          }
        }
      }
      return t;
    },
    extractAllSchemaValuesFromJSONLD: function () {
      let t = {};
      const e = document.querySelector('script[type="application/ld+json"]');
      if (!e) return t;
      let r, a;
      try {
        r = JSON.parse(e.text);
      } catch (e) {
        return t;
      }
      if (
        ((a = Array.isArray(r) ? r[0]["@context"] : r["@context"]),
        "http://schema.org" !== a && "https://schema.org" !== a)
      )
        return t;
      t[SchemaDataExtractor.containsSchemaOrgKey] = !0;
      let o = [];
      o.unshift(r);
      const s = o.shift();
      for (let e in s) t[e] = s[e];
      return t;
    },
    resultHasAddressOrTelephone: function (t) {
      return (
        null != t &&
        (Object.prototype.hasOwnProperty.call(t, "streetAddress") ||
          Object.prototype.hasOwnProperty.call(t, "telephone"))
      );
    },
    resultHasSchemaOrgInfo: function (t) {
      return (
        null != t &&
        Object.prototype.hasOwnProperty.call(
          t,
          SchemaDataExtractor.containsSchemaOrgKey,
        )
      );
    },
    extractSchemaValuesFromSchemaOrg: function () {
      let t = this.extractAllSchemaValuesFromMicroData(),
        e = this.extractFilteredSchemaValuesFromMicroData();
      return (
        this.resultHasAddressOrTelephone(e) ||
          (e = this.extractFilteredSchemaValuesFromJSONLD()),
        this.resultHasAddressOrTelephone(t) ||
          (t = this.extractAllSchemaValuesFromJSONLD()),
        (this.resultHasAddressOrTelephone(e) ||
          this.resultHasSchemaOrgInfo(e)) &&
          (e.url = location.href),
        [e, t]
      );
    },
  }),
  "undefined" == typeof SchemaDataExtractorJS &&
    (SchemaDataExtractorJS = new SchemaDataExtractor()),
  SchemaDataExtractorJS.extractSchemaValuesFromSchemaOrg());
