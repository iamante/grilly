export type DeliveryQuote = {
	fee: number;
	etaLabel: string;
	zoneLabel: string;
};

export type TrackingStep = {
	title: string;
	description: string;
};

export type DeliveryRider = {
	name: string;
	phone: string;
	vehicle: string;
	plate: string;
};

const zoneRules = [
	{
		keywords: ["makati", "poblacion", "salcedo", "legazpi"],
		fee: 39,
		etaLabel: "20-25 min",
		zoneLabel: "Core delivery zone",
	},
	{
		keywords: ["taguig", "bgc", "bonifacio", "pasig", "mandaluyong"],
		fee: 59,
		etaLabel: "25-35 min",
		zoneLabel: "Metro fast lane",
	},
	{
		keywords: ["manila", "quezon city", "qc", "san juan", "paranaque"],
		fee: 79,
		etaLabel: "35-45 min",
		zoneLabel: "Extended city zone",
	},
];

export const trackingSteps: TrackingStep[] = [
	{
		title: "Order placed",
		description: "Your grill order is in the queue and waiting for kitchen confirmation.",
	},
	{
		title: "Preparing",
		description: "The kitchen is firing everything up and packing your order for handoff.",
	},
	{
		title: "Rider assigned",
		description: "A rider has been matched and is heading to the store for pickup.",
	},
	{
		title: "On the way",
		description: "Your rider has the order and is making the final trip to your address.",
	},
	{
		title: "Delivered",
		description: "Your order has arrived. Time to eat while it is still hot.",
	},
];

const riderPool: DeliveryRider[] = [
	{
		name: "Paolo M.",
		phone: "0917 845 1123",
		vehicle: "Red Honda Click",
		plate: "MC 2184",
	},
	{
		name: "Jessa R.",
		phone: "0917 522 4408",
		vehicle: "Black Yamaha Mio",
		plate: "MC 1047",
	},
	{
		name: "Carlo D.",
		phone: "0917 664 9082",
		vehicle: "White Suzuki Burgman",
		plate: "MC 3319",
	},
	{
		name: "Mika T.",
		phone: "0917 701 6635",
		vehicle: "Blue Honda Beat",
		plate: "MC 2871",
	},
];

export function getDeliveryQuote(address: string): DeliveryQuote {
	const normalized = address.trim().toLowerCase();
	const matchedRule = zoneRules.find((rule) =>
		rule.keywords.some((keyword) => normalized.includes(keyword)),
	);

	if (matchedRule) {
		return {
			fee: matchedRule.fee,
			etaLabel: matchedRule.etaLabel,
			zoneLabel: matchedRule.zoneLabel,
		};
	}

	return {
		fee: 99,
		etaLabel: "40-55 min",
		zoneLabel: "Outer delivery zone",
	};
}

export function getDeliveryStatusLabel(status: string, createdAt: string) {
	const ageMinutes = Math.max(
		0,
		Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000),
	);

	if (status === "cancelled") {
		return "Cancelled";
	}

	if (status === "delivered") {
		return "Delivered";
	}

	if (ageMinutes < 5) {
		return "Order placed";
	}

	if (ageMinutes < 15) {
		return "Preparing";
	}

	if (ageMinutes < 28) {
		return "Rider assigned";
	}

	return "On the way";
}

export function getDeliveryProgress(status: string, createdAt: string) {
	const label = getDeliveryStatusLabel(status, createdAt);

	switch (label) {
		case "Order placed":
			return 0.2;
		case "Preparing":
			return 0.45;
		case "Rider assigned":
			return 0.72;
		case "On the way":
			return 0.9;
		case "Delivered":
			return 1;
		default:
			return 0;
	}
}

export function getTrackingStepIndex(status: string, createdAt: string) {
	return Math.max(
		0,
		trackingSteps.findIndex(
			(step) => step.title === getDeliveryStatusLabel(status, createdAt),
		),
	);
}

export function getAssignedRider(orderId: string) {
	let hash = 0;

	for (const char of orderId) {
		hash += char.charCodeAt(0);
	}

	return riderPool[hash % riderPool.length];
}

export function canCancelOrder(status: string, createdAt: string) {
	if (status === "cancelled" || status === "delivered") {
		return false;
	}

	const label = getDeliveryStatusLabel(status, createdAt);
	return label === "Order placed" || label === "Preparing";
}
