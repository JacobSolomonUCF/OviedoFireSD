package comtelekpsi.github.oviedofireandroid;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.Timer;
import java.util.TimerTask;

public class ResultsActivity extends AppCompatActivity {

    private TableLayout mTableLayout;
    private LinearLayout mLinearLayout;
    private TextView mUsernameTextView;
    private TextView mCBTextView;
    private TextView mTitleTextView;
    private TextView mDateCBTextView;
    private String formId;
    private String uid;
    private String username;
    public static final String UID_SAVE = "UIDSaveFile";
    private URL url;
    Context context;
    boolean isTablet;
    private Activity activity;
    private Button mEditButton;
    private Timer timer;
    private boolean timerFlag;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_results);
        Resources res = getResources();
        isTablet=res.getBoolean(R.bool.isTablet);
        final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid = uidSave.getString("pUID", null);
        username = uidSave.getString("pUsername", null);
        Log.e("HEREHERE","Results successfully retrieved username: "+username);
        formId = getIntent().getStringExtra("FORM_ID");
        mTableLayout=(TableLayout) findViewById(R.id.tableResultsLayout);
        context = this;
        activity=this;
        timerFlag=true;
        mEditButton=(Button)findViewById(R.id.resultsEditButton);
        mCBTextView = (TextView) findViewById(R.id.completedByResultsTextView);
        mDateCBTextView = (TextView) findViewById(R.id.dateCBResultsTextView);
        mTitleTextView = (TextView) findViewById(R.id.formTitleResultsTextView);
        mTitleTextView.setTextColor(Color.BLACK);
        mLinearLayout = (LinearLayout) findViewById(R.id.linearResultsLayout);
        mUsernameTextView=(TextView) findViewById(R.id.usernameResultsTextView);
        mUsernameTextView.setText(username);
        new ResultsActivity.RetrieveJSON().execute();
        mEditButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context, FormActivity.class);
                timerFlag=false;
                intent.putExtra("FORM_ID", formId);
                intent.putExtra("EDIT", true);
                startActivity(intent);
                activity.finish();
            }
        });
    }

    class RetrieveJSON extends AsyncTask<Void, Void, String> {
        private ProgressDialog dialog = new ProgressDialog(ResultsActivity.this);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        protected String doInBackground(Void... urls) {
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/results/?uid="+uid+"&formId="+formId);
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
                }
                finally{
                    urlConnection.disconnect();
                }
            }
            catch(Exception e) {
                Log.e("ERROR", e.getMessage(), e);
                return null;
            }
        }
        protected void onPostExecute(String response) {
            if(response == null)
                response = "THERE WAS AN ERROR";
            Log.i("INFO", response);
            if (dialog.isShowing()) {
                dialog.dismiss();
            }
            ResultsJSONParser.resultsParse(response, mTitleTextView, mCBTextView, mDateCBTextView, mTableLayout, context, isTablet);
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

    @Override
    protected void onResume() {
        super.onResume();
        if (timer != null) {
            timer.cancel();
            Log.i("Main", "cancel timer");
            timer = null;
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
            Intent i = new Intent(ResultsActivity.this, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            finish();
        }
    }
}
