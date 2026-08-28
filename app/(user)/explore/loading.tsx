export default function ExploreLoading() {
  return (
    <main
      className="
        min-h-[calc(100dvh-72px)]
        bg-[#f7f8f6]
        pb-28
        md:pb-14
      "
    >
      <section
        className="
          border-b
          border-black/[0.05]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            max-w-[1440px]
            animate-pulse
            px-5
            py-8
            sm:px-6
            md:py-12
            lg:px-8
          "
        >
          <div
            className="
              h-3 w-32
              rounded-full
              bg-black/[0.06]
            "
          />

          <div
            className="
              mt-5 h-12
              w-full
              max-w-[570px]
              rounded-[14px]
              bg-black/[0.07]
            "
          />

          <div
            className="
              mt-3 h-12
              w-[75%]
              max-w-[450px]
              rounded-[14px]
              bg-black/[0.07]
            "
          />

          <div
            className="
              mt-5 h-4
              w-[360px]
              max-w-full
              rounded-full
              bg-black/[0.045]
            "
          />

          <div
            className="
              mt-8 h-[56px]
              max-w-3xl
              rounded-full
              bg-black/[0.05]
            "
          />

          <div
            className="
              mt-5 flex
              gap-2
            "
          >
            {[72, 88, 94, 70].map(
              (width) => (
                <div
                  key={width}
                  style={{
                    width,
                  }}
                  className="
                    h-9
                    shrink-0
                    rounded-full
                    bg-black/[0.05]
                  "
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className="
          mx-auto
          max-w-[1440px]
          animate-pulse
          px-5
          py-9
          sm:px-6
          md:py-12
          lg:px-8
        "
      >
        <div
          className="
            h-3 w-20
            rounded-full
            bg-black/[0.05]
          "
        />

        <div
          className="
            mt-3 h-8
            w-52
            rounded-lg
            bg-black/[0.07]
          "
        />

        <div
          className="
            mt-7 grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {Array.from({
            length: 6,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-black/[0.04]
                  bg-white
                "
              >
                <div
                  className="
                    aspect-[4/3]
                    bg-black/[0.055]
                  "
                />

                <div className="p-5">
                  <div
                    className="
                      h-2.5 w-20
                      rounded-full
                      bg-black/[0.05]
                    "
                  />

                  <div
                    className="
                      mt-3 h-5
                      w-2/3
                      rounded
                      bg-black/[0.07]
                    "
                  />

                  <div
                    className="
                      mt-5 h-3
                      w-full
                      rounded-full
                      bg-black/[0.04]
                    "
                  />

                  <div
                    className="
                      mt-2 h-3
                      w-1/2
                      rounded-full
                      bg-black/[0.04]
                    "
                  />
                </div>
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  );
}