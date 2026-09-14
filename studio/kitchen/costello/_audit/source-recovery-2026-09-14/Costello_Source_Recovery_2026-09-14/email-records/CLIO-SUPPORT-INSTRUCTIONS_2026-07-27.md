# Clio Support instructions — recovered email record

**Original source:** Clio Support email to Noelle Chung, forwarded by Kris Costello to Luis Sánchez on 13 September 2026  
**Original support date:** 27 July 2026  
**Status:** SOURCE RECOVERED · IMPLEMENTATION DECISION OPEN

## What the original Clio instructions actually describe

The recovered Clio Support message describes **domain mapping for a website hosted inside Clio Grow**. It instructs the firm to point its custom domain to Clio by changing DNS A records.

The message explicitly warns that:

- once the domain is connected to the Clio Grow website, the prior website content will no longer be available at that domain;
- if the firm later leaves Clio, it keeps the domain but loses access to the website content hosted in Clio Grow.

The support email gives two Clio IP values for the required A records:

- `52.223.37.0`
- `35.71.140.199`

and says the records are required for both the root domain and `www` host.

## Current project interpretation

This is **not the same thing as connecting Clio intake, scheduling, or lead-capture functionality to an independently hosted Costello website**.

The current Costello website engagement is building an independently hosted site. Pointing `costellolawfirm.com` to a Clio Grow-hosted website would instead make the Clio-hosted site the primary website.

Kris subsequently clarified that the firm is **not invested in hosting the site in Clio** and does want to use **Clio intake**. The exact integration path therefore remains to be confirmed with Clio.

## Reference treatment

Use this record in **Reference** as provenance for the Clio question.

Recommended status:

**RECEIVED · INTEGRATION PATH TO CONFIRM**

Do not represent this as a completed integration specification.
