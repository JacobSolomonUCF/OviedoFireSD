package comtelekpsi.github.oviedofireandroid;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.AsyncTask;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatButton;
import android.support.v7.widget.AppCompatImageButton;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Timer;
import java.util.TimerTask;


public class MainMenuActivity extends AppCompatActivity {

    private String formId;
    private String uid;
    private String username;
    TextView mTextView;
    AppCompatImageButton logoutButton;
    boolean isTablet;
    Context context;
    AppCompatButton activeVehiclesButton;
    AppCompatButton offTruckButton;
    AppCompatButton qrCodeButton;
    AppCompatButton toDoButton;
    public static final String UID_SAVE = "UIDSaveFile";
    private Timer timer;
    private boolean timerFlag;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_menu);
        context=this;
        final Activity activity = this;
        Resources res = getResources();
        isTablet=res.getBoolean(R.bool.isTablet);
        timerFlag=true;

        mTextView=(TextView) findViewById(R.id.usernameTextView);
        //ToDo: don't need both ways of getting uid
        //ToDo: don't need both ways of getting uid
        //uid = getIntent().getStringExtra("USER_ID");
        final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        if(uid == null || uid.isEmpty()) {
            uid = uidSave.getString("pUID", null);
            System.out.println("In MMActivity, uid pulled from uidSave is "+uid);
        }
        if(username == null || username.isEmpty()) {
            username = uidSave.getString("pUsername", null);
            System.out.println("In MMActivity, username pulled from uidSave is "+username);
        }
        if(username == null || username.isEmpty()) {
            new MainMenuActivity.GetUsername().execute();
            System.out.println("In MMActivity, username was null, so executed getusername");
        }

        logoutButton = (AppCompatImageButton) findViewById(R.id.logoutButton);
        logoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which){
                            case DialogInterface.BUTTON_POSITIVE:
                                //Yes button clicked
                                //logout of firebase
                                //return to login screen
                                timerFlag=false;
                                FirebaseAuth.getInstance().signOut();
                                SharedPreferences.Editor editor = uidSave.edit();
                                editor.clear();
                                editor.commit();
                                Intent intent = new Intent(MainMenuActivity.this, MainActivity.class);
                                startActivity(intent);
                                activity.finish();
                                break;
                            case DialogInterface.BUTTON_NEGATIVE:
                                //No button clicked
                                break;
                        }
                    }
                };
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setMessage("Are you sure you want to logout?").setPositiveButton("Yes", dialogClickListener)
                        .setNegativeButton("No", dialogClickListener).show();
            }
        });
        activeVehiclesButton=(AppCompatButton)findViewById(R.id.activeVehiclesButton);
        if(isTablet)activeVehiclesButton.setTextSize(40);
        activeVehiclesButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                Intent intent = new Intent(MainMenuActivity.this, ActiveVehicleActivity.class);
                //intent.putExtra("USER_NAME", username);
                //intent.putExtra("USER_ID", uid);
                startActivity(intent);
            }
        });
        offTruckButton=(AppCompatButton)findViewById(R.id.offTruckButton);
        if(isTablet)offTruckButton.setTextSize(40);
        offTruckButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                Intent intent = new Intent(MainMenuActivity.this, OffTruckActivity.class);
                //intent.putExtra("USER_NAME", username);
                //intent.putExtra("USER_ID", uid);
                startActivity(intent);
            }
        });
        toDoButton=(AppCompatButton)findViewById(R.id.toDoListButton);
        if(isTablet)toDoButton.setTextSize(40);
        toDoButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                Intent intent = new Intent(MainMenuActivity.this, ToDoListActivity.class);
                //intent.putExtra("USER_NAME", username);
                //intent.putExtra("USER_ID", uid);
                startActivity(intent);
            }
        });
        qrCodeButton=(AppCompatButton)findViewById(R.id.qrScannerButton);
        if(isTablet)qrCodeButton.setTextSize(40);
        qrCodeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                IntentIntegrator intentIntegrator = new IntentIntegrator(activity);
                intentIntegrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE_TYPES);
                intentIntegrator.setPrompt("Scan the QR code");
                intentIntegrator.setOrientationLocked(false);
                intentIntegrator.initiateScan();
            }
        });
    }
    @Override
    public void onBackPressed() {
        logoutButton.callOnClick();
    }

    class GetUsername extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            URL url;
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/userInfo/?uid=" + uid);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while ((line = bufferedReader.readLine()) != null) {
                        stringBuilder.append(line).append("\n");
                    }
                    bufferedReader.close();
                    System.out.println(stringBuilder.toString());
                    return stringBuilder.toString();
                } finally {
                    urlConnection.disconnect();
                }
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        protected void onPostExecute(String response) {
            System.out.println("post executed here");
            System.out.println(response);
            int first=response.indexOf("firstName");
            int last=response.indexOf("lastName");
            int end=response.length();
            String firstName=response.substring(first+12,last-3);
            String lastName=response.substring(last+11,end-3);
            username=firstName+" "+lastName;
            mTextView.setText("Welcome "+username);
            Log.i("INFO", response);
            SharedPreferences uidSave = getSharedPreferences(UID_SAVE, 0);
            SharedPreferences.Editor editor = uidSave.edit();
            editor.putString("pUsername", username);
            editor.commit();
        }
    }

    @Override
    protected void onResume(){
        super.onResume();
        TextView mTextView=(TextView) findViewById(R.id.usernameTextView);
        SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        if(uid == null || uid.isEmpty()) {
            uid = uidSave.getString("pUID", null);
        }
        if(username == null || username.isEmpty()) {
            username = uidSave.getString("pUsername", null);
        }
        mTextView.setText("Welcome "+username);
        if (timer != null) {
            timer.cancel();
            Log.i("Main", "cancel timer");
            timer = null;
        }
    }

    /*@Override
    protected void onStop(){
        super.onStop();
        SharedPreferences uidSave = getSharedPreferences(UID_SAVE, 0);
        SharedPreferences.Editor editor = uidSave.edit();
        editor.putString("pUID", uid);
        editor.putString("pUsername", username);
        editor.commit();
    }*/
    /*public void activeVehicle(View view)
    {
        Intent intent = new Intent(MainMenuActivity.this, ActiveVehicleActivity.class);
        intent.putExtra("USER_NAME", username);
        intent.putExtra("USER_ID", uid);
        startActivity(intent);
    }

    public void offTruck(View view)
    {
        Intent intent = new Intent(MainMenuActivity.this, OffTruckActivity.class);
        intent.putExtra("USER_NAME", username);
        intent.putExtra("USER_ID", uid);
        startActivity(intent);
    }

    public void toDoList(View view){
        Intent intent = new Intent(MainMenuActivity.this, ToDoListActivity.class);
        intent.putExtra("USER_NAME", username);
        intent.putExtra("USER_ID", uid);
        startActivity(intent);
    }


    public void qrScanner(View view){
        IntentIntegrator intentIntegrator = new IntentIntegrator(this);
        intentIntegrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE_TYPES);
        intentIntegrator.setPrompt("Scan the QR code");
        intentIntegrator.setOrientationLocked(false);
        intentIntegrator.initiateScan();

    }
    */
    // Get the results:
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        timerFlag=false;
        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if(result != null) {
            if(result.getContents() == null) {
                Toast.makeText(this, "Unsuccessful scan", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(this, "Scanned: " + result.getContents(), Toast.LENGTH_LONG).show();
                formId=result.getContents();
                new MainMenuActivity.CompletionCheck().execute();
            }
        } else {
            Toast.makeText(this, "Unsuccessful scan", Toast.LENGTH_LONG).show();
            return;
            //super.onActivityResult(requestCode, resultCode, data);
        }
    }

    class CompletionCheck extends AsyncTask<Void, Void, String> {
        private ProgressDialog dialog = new ProgressDialog(context);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        @Override
        protected String doInBackground(Void... params) {
            URL url;
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/checkCompletion/?uid="+uid+"&formId="+formId);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while ((line = bufferedReader.readLine()) != null) {
                        stringBuilder.append(line).append("\n");
                    }
                    bufferedReader.close();
                    System.out.println(stringBuilder.toString());
                    return stringBuilder.toString();
                } finally {
                    urlConnection.disconnect();
                }
            }
            catch (Exception e){
                e.printStackTrace();
                return null;
            }
        }
        protected void onPostExecute(String response) {
            //System.out.println(response.charAt(1));
            if(response==null){
                Toast.makeText(context, "form not found", Toast.LENGTH_LONG).show();
            }
            else if(response.charAt(0)=='t'){
                System.out.println("read as true");
                timerFlag=false;
                Toast.makeText(MainMenuActivity.this, "Form Already Completed: Loading completed form",
                        Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(context, ResultsActivity.class);
                intent.putExtra("FORM_ID", formId);
                startActivity(intent);
            }
            else if (response.charAt(0)=='f'){
                System.out.println("read as false");
                timerFlag=false;
                Toast.makeText(MainMenuActivity.this, "Loading form to complete",
                        Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(context, FormActivity.class);
                intent.putExtra("FORM_ID", formId);
                intent.putExtra("EDIT", false);
                startActivity(intent);
            }
            else{
                System.out.println("hell if I know");
            }
            if (response==null)
                response="invalid formId";
            Log.i("INFO", response);
            if (dialog.isShowing())
                dialog.dismiss();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if(timerFlag) {
            timer = new Timer();
            Log.i("Main", "Invoking logout timer");
            LogOutTimerTask logoutTimeTask = new LogOutTimerTask();
            timer.schedule(logoutTimeTask, 10800000); //auto logout in 180 minutes
        }
    }

    private class LogOutTimerTask extends TimerTask {

        @Override
        public void run() {

            //logout
            final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
            FirebaseAuth.getInstance().signOut();
            SharedPreferences.Editor editor = uidSave.edit();
            editor.clear();
            editor.commit();

            //redirect user to login screen
            Intent i = new Intent(MainMenuActivity.this, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            finish();
        }
    }
}
