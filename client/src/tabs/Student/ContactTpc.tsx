/**
 * @file This file contains the ContactTpc component, which displays a list of TPC members.
 */

import { TPC } from "@/components/custom/TPC";
import { API_ROUTES } from "@/lib/apiRoutes";
import { useEffect, useState } from "react";

/**
 * Represents a TPC member.
 * @interface
 */
interface TpcMember {
  /**
   * The unique identifier of the TPC member.
   * @type {string}
   */
  _id: string;
  /**
   * The name of the TPC member.
   * @type {string}
   */
  name: string;
  /**
   * The position of the TPC member.
   * @type {string}
   */
  dept_name: string;
  /**
   * The contact number of the TPC member.
   * @type {string}
   */
  mobile: string;
}

/**
 * The ContactTpc component, which displays a list of TPC members.
 * @returns {JSX.Element} The ContactTpc component.
 */
export function ContactTpc() {
  const [tpcMembers, setTpcMembers] = useState<TpcMember[]>([]);

  useEffect(() => {
    /**
     * Fetches the TPC members from the API.
     * @returns {Promise<void>}
     */
    const fetchTpcMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_ROUTES.ALL_TPC_PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data.data?.profiles)) {
          setTpcMembers(data.data.profiles);
        } else {
          setTpcMembers([]); // Set to empty array if not an array
        }
      } catch (error) {
        console.error("Error fetching TPC members:", error);
        setTpcMembers([]); // Set to empty array on error as well
      }
    };

    fetchTpcMembers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tpcMembers.map((member: TpcMember) => (
            <TPC
              key={member._id}
              // studentId={member._id}
              name={member.name}
              department={member.dept_name}
              contact={member.mobile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
