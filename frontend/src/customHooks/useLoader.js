import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../redux/loaderSlice";

export const useLoader = () => {
	const dispatch = useDispatch();

	const showLoader = (message = "Loading...") => {
		dispatch(startLoading(message));
	};

	const hideLoader = () => {
		dispatch(stopLoading());
	};

	return { showLoader, hideLoader };
};
