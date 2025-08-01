import { env } from "@/data/env/client";

export function Banner({
  message,
  mappings,
  customization,
  canRemoveBranding,
}: {
  canRemoveBranding: boolean;
  message: string;
  mappings: {
    coupon: string;
    discount: string;
    country: string;
  };
  customization: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    isSticky: boolean;
    classPrefix?: string | null;
  };
}) {
  const prefix = customization.classPrefix ?? "";
  const mappedMessage = Object.entries(mappings).reduce(
    (mappedMessage, [key, value]) => {
      return mappedMessage.replace(new RegExp(`{${key}}`, "g"), value);
    },
    message.replace(/'/g, "&#39;")
  );

  const formattedProjectTitle = env.NEXT_PUBLIC_PROJECT_TITLE.replace(/\s+/g, "-").toLowerCase();
  return (
    <>
      <style type="text/css">
        {`
          .${prefix}${formattedProjectTitle}-container {
            all: revert;
            display: flex;
            flex-direction: column;
            gap: .5em;
            background-color: ${customization.backgroundColor};
            color: ${customization.textColor};
            font-size: ${customization.fontSize};
            font-family: inherit;
            padding: 1rem;
            ${customization.isSticky ? "position: sticky;" : ""}
            left: 0;
            right: 0;
            top: 0;
            text-wrap: balance;
            text-align: center;
          }

          .${prefix}${formattedProjectTitle}-branding {
            color: inherit;
            font-size: inherit;
            display: inline-block;
            text-decoration: underline;
          }
        `}
      </style>
      <div
        className={`${prefix}${formattedProjectTitle}-container ${prefix}${formattedProjectTitle}-override`}
      >
        <span
          className={`${prefix}${formattedProjectTitle}-message ${prefix}${formattedProjectTitle}-override`}
          dangerouslySetInnerHTML={{
            __html: mappedMessage,
          }}
        />
        {!canRemoveBranding && (
          <a
            className={`${prefix}-branding`}
            href={`${env.NEXT_PUBLIC_SERVER_URL}`}
          >
            Powered by {formattedProjectTitle}
          </a>
        )}
      </div>
    </>
  );
}
