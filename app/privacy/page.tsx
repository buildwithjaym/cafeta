import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  Database,
  Eye,
  FileText,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | CAFÉTA",
  description:
    "Learn how CAFÉTA handles account information, community content, location data, and other information used by the platform.",
};

const sections = [
  {
    id: "information-we-collect",
    number: "01",
    title: "Information we collect",
  },
  {
    id: "how-we-use-information",
    number: "02",
    title: "How we use information",
  },
  {
    id: "community-content",
    number: "03",
    title: "Community content",
  },
  {
    id: "location",
    number: "04",
    title: "Location information",
  },
  {
    id: "business-information",
    number: "05",
    title: "Business information",
  },
  {
    id: "service-providers",
    number: "06",
    title: "Service providers",
  },
  {
    id: "security",
    number: "07",
    title: "Security",
  },
  {
    id: "your-choices",
    number: "08",
    title: "Your choices",
  },
  {
    id: "children",
    number: "09",
    title: "Children's privacy",
  },
  {
    id: "changes",
    number: "10",
    title: "Changes to this policy",
  },
  {
    id: "contact",
    number: "11",
    title: "Contact",
  },
];

export default function PrivacyPage() {
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
              <ShieldCheck className="size-3.5" />
              Privacy at CAFÉTA
            </div>

            <h1 className="mt-5 text-[2.7rem] font-black leading-[0.98] tracking-[-0.06em] sm:text-[4rem] lg:text-[4.7rem]">
              Privacy Policy
            </h1>

            <p className="mt-6 max-w-2xl text-[14px] leading-7 text-black/48 sm:text-[16px] sm:leading-8">
              CAFÉTA is built around local discovery and community
              participation. This Privacy Policy explains the types of
              information the platform may handle, why that information is
              used, and the choices available to you.
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
            <LegalIntro icon={<Eye className="size-5" />}>
              We want CAFÉTA users to understand what happens to their
              information. The platform uses information to operate accounts,
              make local discovery useful, support community features, and
              maintain the service.
            </LegalIntro>

            <LegalSection
              id="information-we-collect"
              number="01"
              title="Information we collect"
            >
              <p>
                The information CAFÉTA handles depends on how you use the
                platform. You may browse certain public information without
                creating an account, while features such as Memories, reviews,
                saved places, and business management may require you to sign
                in.
              </p>

              <LegalSubsection title="Account and profile information">
                <p>
                  When you create or maintain a CAFÉTA account, information
                  associated with your account may include your name, email
                  address, username, profile photo, biography, and account
                  preferences.
                </p>
              </LegalSubsection>

              <LegalSubsection title="Content you contribute">
                <p>
                  When you participate in the CAFÉTA community, we handle the
                  information you choose to submit. This may include Memories,
                  uploaded photos, captions, reviews, ratings, comments, likes,
                  and other interactions with places or community content.
                </p>
              </LegalSubsection>

              <LegalSubsection title="Saved places and preferences">
                <p>
                  CAFÉTA may store businesses you save and preferences you
                  provide so the platform can maintain your account experience
                  and make discovery more relevant to you.
                </p>
              </LegalSubsection>

              <LegalSubsection title="Authentication and technical information">
                <p>
                  Information necessary to authenticate your account and
                  operate the service may also be processed. Some of this
                  information is handled through the infrastructure and service
                  providers used to operate CAFÉTA.
                </p>
              </LegalSubsection>
            </LegalSection>

            <LegalSection
              id="how-we-use-information"
              number="02"
              title="How we use information"
            >
              <p>
                CAFÉTA uses information to provide and improve the platform and
                its features. Depending on how you use CAFÉTA, this can include
                authenticating your account, displaying your profile, saving
                your preferences, presenting business information, and
                enabling community interactions.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <UseCard
                  icon={<UserRound className="size-4" />}
                  title="Operate your account"
                  text="Maintain your profile, preferences, saved places, and signed-in experience."
                />

                <UseCard
                  icon={<MapPin className="size-4" />}
                  title="Support discovery"
                  text="Help you find relevant cafés, milk-tea shops, and other available places."
                />

                <UseCard
                  icon={<Users className="size-4" />}
                  title="Enable community features"
                  text="Display Memories, reviews, comments, likes, and other community interactions."
                />

                <UseCard
                  icon={<Database className="size-4" />}
                  title="Maintain CAFÉTA"
                  text="Operate, secure, troubleshoot, and improve the platform and its features."
                />
              </div>
            </LegalSection>

            <LegalSection
              id="community-content"
              number="03"
              title="Community content and visibility"
            >
              <p>
                CAFÉTA is a community discovery platform. Information you
                intentionally contribute to community-facing features may be
                visible to other people who are permitted to access those
                features.
              </p>

              <p>
                For example, your username or profile identity may appear
                alongside a Memory, review, rating, comment, or other content
                you submit. Photos and captions you post as Memories may also
                be associated with the business where the Memory was shared.
              </p>

              <Notice>
                Before posting, remember that community content is intended to
                be seen by other CAFÉTA users. Avoid including private,
                sensitive, or confidential information in Memories, reviews,
                comments, or other public-facing submissions.
              </Notice>
            </LegalSection>

            <LegalSection
              id="location"
              number="04"
              title="Location information"
            >
              <p>
                CAFÉTA includes location-based discovery features. If you choose
                to use functionality such as finding businesses near you, your
                device or browser may ask you for permission to provide your
                location.
              </p>

              <p>
                Location access is used to support features that depend on your
                position, such as nearby discovery. You can control location
                permission through your browser or device settings. Some
                location-based features may not work as intended when location
                access is unavailable.
              </p>
            </LegalSection>

            <LegalSection
              id="business-information"
              number="05"
              title="Business information"
            >
              <p>
                Business owners or authorized business members may submit
                information for a CAFÉTA business profile. This can include the
                business name, category, description, address, contact
                information, operating hours, menu information, images, social
                links, and location coordinates.
              </p>

              <p>
                Information submitted for a public business profile is intended
                to help people discover and understand that business and may
                therefore be displayed to CAFÉTA users.
              </p>
            </LegalSection>

            <LegalSection
              id="service-providers"
              number="06"
              title="Service providers"
            >
              <p>
                CAFÉTA relies on third-party technology and infrastructure to
                operate parts of the service. These providers may process
                information as necessary to provide their respective services,
                such as authentication, databases, file storage, hosting, or
                other technical infrastructure.
              </p>

              <p>
                CAFÉTA currently uses Supabase as part of its backend
                infrastructure, including authentication, database, and storage
                functionality.
              </p>
            </LegalSection>

            <LegalSection
              id="security"
              number="07"
              title="Security"
            >
              <p>
                CAFÉTA uses technical and application-level safeguards intended
                to protect information and restrict access according to the
                platform's permissions. These measures may include
                authentication, database access controls, and authorization
                rules.
              </p>

              <p>
                No internet service or storage system can guarantee absolute
                security. Users are also responsible for protecting access to
                their own accounts and devices.
              </p>
            </LegalSection>

            <LegalSection
              id="your-choices"
              number="08"
              title="Your choices"
            >
              <p>
                You can choose what community content you submit and whether to
                grant optional device permissions such as location access.
                Certain profile information and preferences may also be
                editable through CAFÉTA where those controls are available.
              </p>

              <p>
                If you no longer want to use optional browser permissions, you
                can change those permissions through your browser or device.
              </p>
            </LegalSection>

            <LegalSection
              id="children"
              number="09"
              title="Children's privacy"
            >
              <p>
                CAFÉTA is not designed to knowingly collect personal
                information from children in circumstances where parental or
                guardian consent would be legally required. If you believe
                information relating to a child has been submitted
                inappropriately, please contact the platform so the matter can
                be reviewed.
              </p>
            </LegalSection>

            <LegalSection
              id="changes"
              number="10"
              title="Changes to this Privacy Policy"
            >
              <p>
                CAFÉTA may update this Privacy Policy as the platform,
                technology, or legal requirements change. When the policy is
                updated, the effective date displayed on this page should also
                be updated.
              </p>

              <p>
                Continued use of CAFÉTA after an updated policy becomes
                effective means the current version of the policy will apply to
                your use of the service.
              </p>
            </LegalSection>

            <LegalSection
              id="contact"
              number="11"
              title="Contact"
            >
              <p>
                Questions or concerns about this Privacy Policy or privacy on
                CAFÉTA can be directed to the developer of the platform.
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
              href="/terms"
              label="Terms of Service"
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
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-[#006241]/10 bg-[#f3f8f5] p-5 sm:p-6">
      <div className="flex size-9 items-center justify-center rounded-full bg-[#006241] text-white">
        {icon}
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

function LegalSubsection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-2">
      <h3 className="text-[12px] font-black text-[#17211c]">
        {title}
      </h3>

      <div className="mt-2">{children}</div>
    </div>
  );
}

function UseCard({
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

type ReactNode = import("react").ReactNode;