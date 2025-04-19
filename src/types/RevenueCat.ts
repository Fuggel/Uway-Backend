export interface SubscriptionStatus {
    request_date: string;
    request_date_ms: number;
    subscriber: Subscriber;
}

export interface Subscriber {
    entitlements: Entitlements;
    first_seen: string;
    last_seen: string;
    management_url: string | null;
    non_subscriptions: Record<string, unknown>;
    original_app_user_id: string;
    original_application_version: string;
    original_purchase_date: string;
    other_purchases: Record<string, unknown>;
    subscriber_attributes: SubscriberAttributes;
    subscriptions: Record<string, Subscription>;
}

export interface Entitlements {
    pro: Entitlement;
}

export interface Entitlement {
    expires_date: string | null;
    grace_period_expires_date: string | null;
    product_identifier: string;
    purchase_date: string;
}

export interface SubscriberAttributes {
    [key: string]: SubscriberAttribute;
}

export interface SubscriberAttribute {
    updated_at_ms: number;
    value: string;
}

export interface Subscription {
    auto_resume_date: string | null;
    billing_issues_detected_at: string | null;
    display_name: string | null;
    expires_date: string;
    grace_period_expires_date: string | null;
    is_sandbox: boolean;
    original_purchase_date: string;
    ownership_type: string;
    period_type: string;
    price: Price;
    purchase_date: string;
    refunded_at: string | null;
    store: string;
    store_transaction_id: string;
    unsubscribe_detected_at: string | null;
}

export interface Price {
    amount: number;
    currency: string;
}
