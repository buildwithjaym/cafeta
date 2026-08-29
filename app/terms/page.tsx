import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  Coffee,
  FileText,
  MapPin,
  MessageCircle,
  Scale,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | CAFÉTA",
  description:
    "Read the terms that apply when accessing and using CAFÉTA.",
};

const sections = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of these Terms",
  },
  {
    id: "accounts",
    number: "02",
    title: "Accounts",
  },
  {
    id: "acceptable-use",
    number: "03",
    title: "Acceptable use",
  },
  {
    id: "community-content",
    number: "04",
    title: "Community content",
  },
  {
    id: "reviews",
    number: "05",
    title: "Reviews and interactions",
  },
  {
    id: "businesses",
    number: "06",
    title: "Business profiles",
  },
  {
    id: "accuracy",
    number: "07",
    title: "Information accuracy",
  },
  {
    id: "intellectual-property",
    number: "08",
    title: "Intellectual property",
  },
  {
    id: "moderation",
    number: "09",
    title: "Moderation and enforcement",
  },
  {
    id: "third-parties",
    number: "10",
    title: "Third-party services",
  },
  {
    id: "availability",
    number: "11",
    title: "Service availability",
  },
  {
    id: "disclaimer",
    number: "12",
    title: "Disclaimer",
  },
  {
    id: "changes",
    number: "13",
    title: "Changes to these Terms",
  },
  {
    id: "contact",
    number: "14",
    title: "Contact",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-[#17211c]">
      <LegalHeader />

      <section className="border-b border-black/[0.055] bg-[#f6f8f6]">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-7 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-bold text-black/40 transition hover:text-[#006241]"
          >
            <ArrowLeft className="size-3.5" />
            Back to CAFÉTA
          </Link>

          <div className="mt-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#006241]/10 bg-[#eaf3ee] px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#006241]">
              <Scale className="size-3.5" />
              Using CAFÉTA
            </div>

            <h1 className="mt-5 text-[2.7rem] font-black leading-[0.98] tracking-[-0.06em] sm:text-[4rem] lg:text-[4.7rem]">
              Terms of Service
            </h1>

            <p className="mt-6 max-w-2xl text-[14px] leading-7 text-black/48 sm:text-[16px] sm:leading-8">
              These Terms explain the rules and responsibilities that apply
              when you access or use CAFÉTA, including its discovery,
              community, review, and business features.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-black/[0.06] pt-5 text-[10px] text-black/35">
              <span>
                <strong className="font-black text-black/55">
                  Effective:
                </strong>{" "}
                August 28, 2026
              </span>

              <span>
                <strong className="font-black text-black/55">
                  Platform:
                </strong>{" "}
                CAFÉTA
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-7 sm:py-20 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16 lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-black/25">
                On this page
              </p>

              <nav className="mt-4 flex flex-col">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex gap-3 border-l border-black/[0.07] py-2.5 pl-4 text-[10px] font-semibold text-black/35 transition hover:border-[#006241] hover:text-[#006241]"
                  >
                    <span className="font-mono text-[8px] text-black/20 group-hover:text-[#006241]/60">
                      {section.number}
                    </span>

                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="min-w-0 max-w-3xl">
            <LegalIntro>
              By accessing or using CAFÉTA, you agree to use the platform
              responsibly and in accordance with these Terms. If you do not
              agree with these Terms, you should not use the service.
            </LegalIntro>

            <LegalSection
              id="acceptance"
              number="01"
              title="Acceptance of these Terms"
            >
              <p>
                These Terms of Service govern your access to and use of CAFÉTA
                and the features made available through the platform.
              </p>

              <p>
                By creating an account, accessing authenticated features, or
                otherwise using CAFÉTA, you acknowledge that you have read and
                agree to these Terms and the applicable Privacy Policy.
              </p>
            </LegalSection>

            <LegalSection
              id="accounts"
              number="02"
              title="Accounts"
            >
              <p>
                Some CAFÉTA features require an account. When creating and
                using an account, you are responsible for providing
                appropriate information and for maintaining the security of
                access to your account.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <RuleCard
                  icon={<UserRound className="size-4" />}
                  title="Use your own account"
                  text="Do not impersonate another person or intentionally misrepresent your identity."
                />

                <RuleCard
                  icon={<ShieldCheck className="size-4" />}
                  title="Protect access"
                  text="You are responsible for activity performed through your account and for protecting access to it."
                />
              </div>

              <p>
                Usernames and profile information must not be used to
                impersonate another person, business, organization, or CAFÉTA
                itself.
              </p>
            </LegalSection>

            <LegalSection
              id="acceptable-use"
              number="03"
              title="Acceptable use"
            >
              <p>
                CAFÉTA exists to help people discover local places and share
                useful community experiences. You agree not to misuse the
                platform or interfere with other people's ability to use it.
              </p>

              <p>You must not use CAFÉTA to:</p>

              <div className="mt-5 space-y-2.5">
                <Rule>
                  Post unlawful, threatening, harassing, hateful, or abusive
                  material.
                </Rule>

                <Rule>
                  Intentionally publish false or misleading information about a
                  person or business.
                </Rule>

                <Rule>
                  Impersonate another user, business, organization, or CAFÉTA.
                </Rule>

                <Rule>
                  Upload content you do not have the right to use or share.
                </Rule>

                <Rule>
                  Spam users, manipulate reviews, or artificially influence
                  community activity.
                </Rule>

                <Rule>
                  Attempt to bypass authentication, authorization, security, or
                  other technical restrictions.
                </Rule>

                <Rule>
                  Interfere with, damage, overload, or abuse CAFÉTA or its
                  underlying infrastructure.
                </Rule>
              </div>
            </LegalSection>

            <LegalSection
              id="community-content"
              number="04"
              title="Community content"
            >
              <p>
                CAFÉTA allows users to contribute content such as Memories,
                photos, captions, comments, and other community interactions.
                You remain responsible for the content you submit.
              </p>

              <p>
                You should only upload or publish content that you have the
                right to share. Your content must not violate another person's
                privacy, intellectual property, or other legal rights.
              </p>

              <Notice>
                Memories are intended to represent genuine experiences and
                useful community participation. Do not use Memories to
                impersonate others, harass people, advertise deceptively, or
                deliberately misrepresent a place.
              </Notice>
            </LegalSection>

            <LegalSection
              id="reviews"
              number="05"
              title="Reviews, ratings, and interactions"
            >
              <p>
                Reviews and ratings should reflect your genuine experience and
                opinion. CAFÉTA may restrict the number or manner of reviews a
                user can submit for a business.
              </p>

              <p>
                You must not use reviews, comments, likes, or other community
                features to manipulate a business's reputation, coordinate
                artificial activity, harass another person, or intentionally
                spread information you know to be false.
              </p>
            </LegalSection>

            <LegalSection
              id="businesses"
              number="06"
              title="Business profiles"
            >
              <p>
                CAFÉTA may allow business owners or authorized representatives
                to create or manage business profiles. If you submit or manage
                a business profile, you represent that you are authorized to
                provide and maintain the information you submit.
              </p>

              <p>
                Business information may include operating hours, menu items,
                prices, images, contact information, social links, location,
                descriptions, and other information intended for customers.
              </p>

              <div className="mt-6 rounded-[20px] border border-black/[0.055] bg-[#fafbfa] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#eaf3ee] text-[#006241]">
                    <Store className="size-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-[#17211c]">
                      Business responsibility
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-black/38">
                      Businesses are responsible for keeping the information
                      they control reasonably accurate and appropriate.
                    </p>
                  </div>
                </div>
              </div>
            </LegalSection>

            <LegalSection
              id="accuracy"
              number="07"
              title="Information accuracy"
            >
              <p>
                CAFÉTA is designed to make local discovery easier, but business
                and community information can change. Operating hours, menu
                items, prices, availability, addresses, descriptions, and
                other information may become outdated or contain errors.
              </p>

              <p>
                Community reviews and Memories represent the experiences or
                opinions of the users who submitted them and do not necessarily
                represent the views of CAFÉTA.
              </p>

              <p>
                When information is important to your plans, you should verify
                it with the relevant business when appropriate.
              </p>
            </LegalSection>

            <LegalSection
              id="intellectual-property"
              number="08"
              title="Intellectual property"
            >
              <p>
                The CAFÉTA name, branding, interface, original design,
                software, and other original platform materials are protected
                by applicable intellectual property laws and may not be copied,
                represented as your own, or used in a misleading manner without
                permission.
              </p>

              <p>
                Users retain responsibility for content they submit. By
                submitting content to community-facing parts of CAFÉTA, you
                give CAFÉTA permission to host, store, display, and make that
                content available as reasonably necessary to operate the
                feature in which you submitted it.
              </p>
            </LegalSection>

            <LegalSection
              id="moderation"
              number="09"
              title="Moderation and enforcement"
            >
              <p>
                CAFÉTA may review, restrict, remove, or otherwise moderate
                content or access when reasonably necessary to protect the
                platform, enforce these Terms, address misuse, comply with
                applicable requirements, or protect users and businesses.
              </p>

              <p>
                Serious or repeated violations may result in restrictions on
                features or account access.
              </p>
            </LegalSection>

            <LegalSection
              id="third-parties"
              number="10"
              title="Third-party services and links"
            >
              <p>
                CAFÉTA may display links or information that directs you to
                external websites, social-media pages, mapping services, or
                other third-party services.
              </p>

              <p>
                Those services operate independently from CAFÉTA and may have
                their own terms, privacy practices, content, and availability.
                CAFÉTA is not responsible for the operation or content of
                third-party services.
              </p>
            </LegalSection>

            <LegalSection
              id="availability"
              number="11"
              title="Service availability and changes"
            >
              <p>
                CAFÉTA may add, modify, improve, suspend, or discontinue
                features as the platform develops. The service may also
                occasionally be unavailable because of maintenance, technical
                issues, infrastructure failures, or circumstances outside the
                platform's control.
              </p>

              <p>
                CAFÉTA does not guarantee that every feature or business
                listing will remain available at all times.
              </p>
            </LegalSection>

            <LegalSection
              id="disclaimer"
              number="12"
              title="Disclaimer"
            >
              <p>
                CAFÉTA is a discovery and community platform. Information on
                the platform is provided to help users explore places and make
                their own decisions.
              </p>

              <p>
                CAFÉTA does not guarantee the quality, safety, availability,
                pricing, accuracy, or suitability of any business, menu item,
                product, service, route, review, Memory, or other third-party
                or user-provided information.
              </p>

              <p>
                Users remain responsible for their own decisions and
                interactions with businesses and other users.
              </p>
            </LegalSection>

            <LegalSection
              id="changes"
              number="13"
              title="Changes to these Terms"
            >
              <p>
                These Terms may be updated as CAFÉTA develops or as legal,
                operational, or technical requirements change. The effective
                date shown at the top of this page should reflect the latest
                version.
              </p>

              <p>
                If you continue using CAFÉTA after updated Terms become
                effective, the updated Terms will apply to your continued use
                of the service.
              </p>
            </LegalSection>

            <LegalSection
              id="contact"
              number="14"
              title="Contact"
            >
              <p>
                Questions about these Terms or the CAFÉTA platform can be
                directed to the developer.
              </p>

              <div className="mt-6 rounded-[20px] border border-[#006241]/10 bg-[#f3f8f5] p-5 sm:p-6">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#006241] text-white">
                  <Coffee className="size-4" />
                </div>

                <p className="mt-4 text-[9px] font-black uppercase tracking-[0.16em] text-[#006241]">
                  CAFÉTA
                </p>

                <h3 className="mt-1 text-lg font-black tracking-[-0.035em]">
                  Jaymar Maruji
                </h3>

                <p className="mt-2 text-[11px] leading-5 text-black/40">
                  Developer of CAFÉTA
                </p>
              </div>
            </LegalSection>

            <LegalBottomLink
              href="/privacy"
              label="Privacy Policy"
            />
          </article>
        </div>
      </section>

      <LegalFooter />
    </main>
  );
}

function LegalHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.05] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-5 sm:h-[70px] sm:px-7 lg:px-8">
        <Link
          href="/"
          className="text-[1.35rem] font-black tracking-[-0.055em] text-[#006241]"
        >
          CAFÉTA
        </Link>

        <Link
          href="/"
          className="group inline-flex h-9 items-center gap-2 rounded-full border border-black/[0.07] px-4 text-[10px] font-black text-black/50 transition hover:border-[#006241]/20 hover:text-[#006241]"
        >
          Back home
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </header>
  );
}

function LegalIntro({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-[#006241]/10 bg-[#f3f8f5] p-5 sm:p-6">
      <div className="flex size-9 items-center justify-center rounded-full bg-[#006241] text-white">
        <FileText className="size-4" />
      </div>

      <p className="mt-4 text-[12px] leading-6 text-black/55 sm:text-[13px]">
        {children}
      </p>
    </div>
  );
}

function LegalSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-b border-black/[0.055] py-10 first:pt-12 sm:py-12"
    >
      <div className="flex gap-3">
        <span className="pt-1 font-mono text-[9px] text-[#006241]/45">
          {number}
        </span>

        <h2 className="text-[1.45rem] font-black tracking-[-0.04em] sm:text-[1.7rem]">
          {title}
        </h2>
      </div>

      <div className="mt-5 space-y-4 text-[12px] leading-6 text-black/52 sm:text-[13px] sm:leading-7">
        {children}
      </div>
    </section>
  );
}

function RuleCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[17px] border border-black/[0.055] bg-[#fafbfa] p-4">
      <div className="flex size-8 items-center justify-center rounded-full bg-[#eaf3ee] text-[#006241]">
        {icon}
      </div>

      <p className="mt-3 text-[10px] font-black text-[#17211c]">
        {title}
      </p>

      <p className="mt-1.5 text-[9px] leading-4 text-black/38">
        {text}
      </p>
    </div>
  );
}

function Rule({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#eaf3ee] text-[#006241]">
        <CheckCircle2 className="size-3" />
      </div>

      <p className="text-[11px] leading-5 text-black/48">
        {children}
      </p>
    </div>
  );
}

function Notice({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-6 border-l-2 border-[#006241] bg-[#f7faf8] px-4 py-3.5 text-[11px] leading-5 text-black/48">
      {children}
    </div>
  );
}

function LegalBottomLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <div className="pt-10">
      <Link
        href={href}
        className="group flex items-center justify-between rounded-[20px] border border-black/[0.06] p-5 transition hover:border-[#006241]/15 hover:bg-[#f8faf9]"
      >
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-black/25">
            Also read
          </p>

          <p className="mt-1 text-[13px] font-black">
            {label}
          </p>
        </div>

        <ArrowRight className="size-4 text-[#006241] transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function LegalFooter() {
  return (
    <footer className="border-t border-black/[0.055] bg-[#fafbfa]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8">
        <div>
          <Link
            href="/"
            className="text-lg font-black tracking-[-0.055em] text-[#006241]"
          >
            CAFÉTA
          </Link>

          <p className="mt-1 text-[9px] text-black/30">
            Find somewhere worth going to.
          </p>
        </div>

        <div className="flex items-center gap-5 text-[9px] font-semibold text-black/40">
          <Link href="/privacy" className="hover:text-[#006241]">
            Privacy
          </Link>

          <Link href="/terms" className="hover:text-[#006241]">
            Terms
          </Link>

          <Link href="/" className="hover:text-[#006241]">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}