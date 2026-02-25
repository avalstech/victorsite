import { defineData, a } from "@aws-amplify/backend";

export const data = defineData({
  authorizationModes: {
    defaultAuthorizationMode: "userPool"
  },
  schema: a.schema({
    SiteSettings: a
      .model({
        id: a.id().required(),
        homeHeroTitle: a.string(),
        homeHeroSubtitle: a.string(),
        socialLinksJson: a.string(),
        timeline: a.json(),
        skills: a.string().array(),
        values: a.string().array(),
        badges: a.string().array(),
        mediaMentions: a.string().array()
      })
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.group("Admin").to(["read", "create", "update", "delete"]),
        allow.group("Editor").to(["read", "create", "update"])
      ]),

    Service: a
      .model({
        id: a.id().required(),
        name: a.string().required(),
        category: a.string().required(),
        shortDescription: a.string().required(),
        priceRange: a.string().required(),
        features: a.string().array(),
        isActive: a.boolean().required()
      })
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.group("Admin").to(["read", "create", "update", "delete"]),
        allow.group("Editor").to(["read", "create", "update"])
      ])
      .secondaryIndexes((idx) => [idx("category").sortKeys(["name"])]),

    Testimonial: a
      .model({
        id: a.id().required(),
        name: a.string().required(),
        title: a.string().required(),
        quote: a.string().required(),
        isActive: a.boolean().required()
      })
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.group("Admin").to(["read", "create", "update", "delete"]),
        allow.group("Editor").to(["read", "create", "update"])
      ]),

    BlogPost: a
      .model({
        id: a.id().required(),
        slug: a.string().required(),
        title: a.string().required(),
        excerpt: a.string().required(),
        bodyHtml: a.string().required(),
        status: a.enum(["DRAFT", "PUBLISHED"]),
        category: a.string().required(),
        tags: a.string().array(),
        featured: a.boolean().required(),
        coverImageKey: a.string(),
        seoTitle: a.string(),
        seoDescription: a.string()
      })
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.group("Admin").to(["read", "create", "update", "delete"]),
        allow.group("Editor").to(["read", "create", "update"])
      ])
      .secondaryIndexes((idx) => [
        idx("slug").sortKeys(["status"]),
        idx("category").sortKeys(["status"])
      ]),

    CaseStudy: a
      .model({
        id: a.id().required(),
        slug: a.string().required(),
        title: a.string().required(),
        summary: a.string().required(),
        industry: a.string().required(),
        tags: a.string().array(),
        techStack: a.string().array(),
        status: a.enum(["DRAFT", "PUBLISHED"]),
        featured: a.boolean().required(),
        sections: a.json().array(),
        metrics: a.json().array(),
        coverImageKey: a.string()
      })
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.group("Admin").to(["read", "create", "update", "delete"]),
        allow.group("Editor").to(["read", "create", "update"])
      ])
      .secondaryIndexes((idx) => [
        idx("slug").sortKeys(["status"]),
        idx("industry").sortKeys(["status"])
      ]),

    Talk: a
      .model({
        id: a.id().required(),
        title: a.string().required(),
        eventName: a.string().required(),
        location: a.string().required(),
        date: a.string(),
        summary: a.string().required(),
        videoUrl: a.string(),
        slidesUrl: a.string()
      })
      .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.group("Admin").to(["read", "create", "update", "delete"]),
        allow.group("Editor").to(["read", "create", "update"])
      ]),

    Lead: a
      .model({
        id: a.id(),
        name: a.string().required(),
        email: a.string().required(),
        inquiryType: a.string().required(),
        company: a.string(),
        budget: a.string(),
        message: a.string().required(),
        attachmentKey: a.string(),
        status: a.enum(["NEW", "CONTACTED", "WON", "LOST"]),
        source: a.string().required(),
        userId: a.string()
      })
      .authorization((allow) => [
        allow.group("Admin").to(["read", "update", "delete"]),
        allow.group("Editor").to(["read", "update"]),
        allow.authenticated.to(["create"])
      ])
      .secondaryIndexes((idx) => [idx("status").sortKeys(["id"]), idx("email").sortKeys(["id"])]),

    NewsletterSubscriber: a
      .model({
        id: a.id().required(), // email lowercase
        email: a.string().required(),
        status: a.enum(["PENDING", "CONFIRMED", "UNSUBSCRIBED"]),
        token: a.string().required(),
        confirmedAt: a.string(),
        unsubscribedAt: a.string()
      })
      .authorization((allow) => [
        allow.group("Admin").to(["read", "update", "delete"]),
        allow.group("Editor").to(["read"]),
        allow.publicApiKey().to(["create", "read", "update"])
      ])
      .secondaryIndexes((idx) => [idx("status").sortKeys(["createdAt"])]),

    Interaction: a
      .model({
        id: a.id().required(), // userId#type#contentId
        userId: a.string().required(),
        contentType: a.enum(["BLOG", "CASE"]),
        contentId: a.string().required(),
        liked: a.boolean().required(),
        bookmarked: a.boolean().required()
      })
      .authorization((allow) => [
        allow.authenticated.to(["read", "create", "update", "delete"])
      ])
      .secondaryIndexes((idx) => [idx("userId").sortKeys(["contentType", "contentId"])]),

    PageView: a
      .model({
        id: a.id(),
        path: a.string().required(),
        referrer: a.string(),
        userAgent: a.string()
      })
      .authorization((allow) => [
        allow.publicApiKey().to(["create"]),
        allow.group("Admin").to(["read", "delete"]),
        allow.group("Editor").to(["read"])
      ])
      .secondaryIndexes((idx) => [idx("path").sortKeys(["createdAt"])]),

    AuditLog: a
      .model({
        id: a.id(),
        action: a.string().required(),
        entity: a.string().required(),
        entityId: a.string().required(),
        metaJson: a.string()
      })
      .authorization((allow) => [
        allow.group("Admin").to(["read", "create", "delete"]),
        allow.group("Editor").to(["read", "create"])
      ])
      .secondaryIndexes((idx) => [idx("entity").sortKeys(["createdAt"])]),

    Outbox: a
      .model({
        id: a.id(),
        type: a.enum(["CONTACT_CONFIRMATION", "NEWSLETTER_CONFIRM"]),
        payloadJson: a.string().required(),
        status: a.enum(["PENDING", "SENT", "FAILED"]),
        error: a.string()
      })
      .authorization((allow) => [
        allow.group("Admin").to(["read", "update", "delete"]),
        allow.group("Editor").to(["read"]),
        allow.publicApiKey().to(["create", "read", "update"]),
        allow.authenticated.to(["create", "read", "update"])
      ])
      .secondaryIndexes((idx) => [idx("status").sortKeys(["createdAt"]), idx("type").sortKeys(["createdAt"])])
  })
});
