package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"

	booking_controller "github.com/ashnchiquita/if4031-ticketing-and-reservation-services/internal/controllers/booking"
	user_controller "github.com/ashnchiquita/if4031-ticketing-and-reservation-services/internal/controllers/user"
	"github.com/ashnchiquita/if4031-ticketing-and-reservation-services/internal/queues"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading env file")
	}

	r := chi.NewRouter()

	r.Use(middleware.Logger)

	// User routes
	r.Post("/user", user_controller.CreateUser)
	r.Get("/user/{userId}", user_controller.GetUserById)
	r.Put("/user/{userId}", user_controller.UpdateUser)
	r.Delete("/user/{userId}", user_controller.DeleteUser)

	// Booking routes
	r.Post("/booking", booking_controller.CreateBooking)
	r.Post("/booking/payment", booking_controller.CreatePayment)

	// RabbitMQ queues initialization
	go queues.InitPaymentQueue()

	// Starts go http server
	http.ListenAndServe(":3333", r)
}
