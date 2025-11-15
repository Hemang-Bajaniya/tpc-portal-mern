/**
 * @file This file contains the ContactTpc component, which displays a list of TPC members.
 */

import { TPC } from "@/components/custom/TPC";
import { API_ROUTES } from "@/lib/apiRoutes";
import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Represents a TPC member.
 */
interface TpcMember {
  _id: string;
  name?: string;
  dept_name?: string;
  mobile?: string;
}

/**
 * The ContactTpc component, which displays a list of TPC members.
 */
export function ContactTpc({ backgroundColor }: { backgroundColor: string }) {
  const [tpcMembers, setTpcMembers] = useState<TpcMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTpcMembers = async () => {
      try {
        const response = await axios.get(API_ROUTES.GET_TPC_CONTACT, {
          withCredentials: true,
        });

        if (response.data?.success && Array.isArray(response.data.data?.profiles)) {
          setTpcMembers(response.data.data.profiles);
        } else {
          setTpcMembers([]);
          throw new Error(response.data?.message || "Failed to fetch TPC members.");
        }
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        setTpcMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTpcMembers();
  }, []);

  return (
    <div className={`min-h-screen ${backgroundColor} p-4`}>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        TPC Contact Information
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-600 mt-10">Loading TPC members...</p>
      )}

      {/* Error */}
      {error && !loading && (
        <p className="text-center text-red-500 mt-10">Error: {error}</p>
      )}

      {/* Empty State */}
      {!loading && !error && tpcMembers.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No TPC members found.</p>
      )}

      {/* Members Grid */}
      {!loading && !error && tpcMembers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tpcMembers.map((member) => (
            <TPC
              key={member._id}
              name={member.name}
              department={member.dept_name}
              contact={member.mobile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
