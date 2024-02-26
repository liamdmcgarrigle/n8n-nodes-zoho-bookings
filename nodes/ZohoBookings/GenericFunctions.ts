import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INode,
	NodeOperationError,
} from "n8n-workflow";
const { DateTime } = require("luxon");

/**
 * Checks to ensure timezone exists and is formatted to match `America/New_York`
 *
 * First will return error if `/` is not in the string
 *
 * Then checks Luxon to see if it is valid
 *
 * Pass in `this.getNode()` for the `node` parameter
 */
export function checkTimeZone (node: INode,  timeZone: string, itemIndex: number ) {
	if (timeZone.indexOf('/') === -1) {
		const description = `The timezone '${timeZone || ' '}' in the 'Time Zone' field isn't valid. Hint: Format your timezone like 'America/New_York', format a DateTime using '.format('z')', or use the expression '{{ $now.format('z') }}' to get the current workflows default time zone in the correct format.`;
		throw new NodeOperationError(node, 'Invalid time zone', {
			description,
			itemIndex,
		});
	} else {
		const tzTest = DateTime.local().setZone(timeZone);
		if(!tzTest.isValid) {
			const description = `The timezone '${timeZone || ' '}' in the 'Time Zone' field isn't valid. Luxon reason: ${tzTest.invalidReason}`;
			throw new NodeOperationError(node, 'Time zone not valis', {
				description,
				itemIndex,
			});
		}
	}

	return
}

export const countryDomains = [
	{
		name: 'United States of America',
		value: '.com',
	},
	{
		name: 'European Union',
		value: '.eu',
	},
	{
		name: 'India',
		value: '.in',
	},
	{
		name: 'Australia',
		value: '.com.au',
	},
	{
		name: 'China',
		value: '.com.cn',
	},
]
export interface defaultCustomerFields {
	"name": string,
	"email": string,
	"phone_number"?: string
}

export interface customCustomerFields {
	[key: string]: any
}

export interface keyValueInputCustomerFields {
	"name":string,
	"value":string
}

export interface createBookingBody {
	"service_id": string,
	"staff_id"?: string,
	"from_time": Date,
	"customer_details": string,
	"time_zone"?: string,
	"resource_id"?: string,
	"group_id"?: string,
	"additional_fields"?: string,
}

export interface rescheduleBookingBody {
	"staff_id"?: string,
	"booking_id": string,
	"start_time"?: string,
	"iso_start_time"?: string
	"time_zone"?: string,
}




export async function getBookingDetails(executeDetails: IExecuteFunctions, baseUrl: string, bookingId: string)  {

	const options: IHttpRequestOptions = {
		url: `${baseUrl}/getappointment?booking_id=${bookingId.replace('#', '')}`,
		method: 'GET',
		json: false,
		headers: {
			"content-type":"multipart/form-data"
		}
	};

		return await executeDetails.helpers.httpRequestWithAuthentication.call(
			executeDetails,
			'zohoBookingsOAuth2Api',
			options,
	);

}

export async function updateBookingStatus(executeDetails: IExecuteFunctions, baseUrl: string, bookingId: string, updatedStatus: "completed" | "cancel" | "noshow" )  {


	let formData = {
		"booking_id": bookingId,
		"action": updatedStatus,
	}

	const options: IHttpRequestOptions = {
		url: `${baseUrl}/updateappointment`,
		method: 'POST',
		json: false,
		body: formData,
		headers: {
			"content-type":"multipart/form-data"
		}
	};

		return await executeDetails.helpers.httpRequestWithAuthentication.call(
			executeDetails,
			'zohoBookingsOAuth2Api',
			options,
	);

}
